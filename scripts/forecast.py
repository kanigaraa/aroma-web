"""Forecast harga pangan dgn Prophet -> JSON per komoditas.

Input : data/processed/{komoditas}.json  (dari preprocess.py)
Output: data/forecast/{komoditas}.json
  per komoditas: { komoditas, tipe_harga, provinsi: [ {
      name, tanggal, harga (riil), forecast, lower, upper, status
    } ], horizon_days }

Untuk tiap provinsi: Prophet fit pada seri historis, forecast N hari ke depan
dengan confidence interval. Nama kolom Prophet wajib 'ds' (tanggal) & 'y' (nilai).

Catatan: kalau provinsi datanya terlalu pendek/berantakan (< 14 titik),
skip (tak cukup utk forecast). Return 0 seri utk provinsi tsb.
"""
import os, json, glob, datetime

try:
    from prophet import Prophet
except ImportError:
    raise SystemExit("Prophet belum terinstall. Jalankan: pip install prophet")

RAW_P = os.path.join(os.path.dirname(__file__), "..", "data", "processed")
OUT = os.path.join(os.path.dirname(__file__), "..", "data", "forecast")
HORIZON_DAYS = 14
MIN_POINTS = 14


def forecast_province(dates, prices, horizon=HORIZON_DAYS):
    """dates: list ISO str, prices: list float sejajar. Return dict atau None."""
    if len(dates) < MIN_POINTS:
        return None
    # siapkan df utk Prophet
    import pandas as pd
    df = pd.DataFrame({"ds": pd.to_datetime(dates), "y": prices})
    # paksa utk data harian
    try:
        m = Prophet(daily_seasonality=False)
        m.fit(df)
    except Exception:
        return None
    future = m.make_future_dataframe(periods=horizon)
    fc = m.predict(future)
    # gabung riil + forecast
    last_date = df["ds"].max()
    series = []
    for i, row in fc.iterrows():
        d = row["ds"].date().isoformat()
        is_future = row["ds"] > last_date
        series.append({
            "tanggal": d,
            "harga": float(row["yhat"]) if is_future else (float(df.loc[df["ds"] == row["ds"], "y"].iloc[0]) if len(df.loc[df["ds"] == row["ds"]]) else None),
            "forecast": float(row["yhat"]),
            "lower": float(row["yhat_lower"]),
            "upper": float(row["yhat_upper"]),
            "is_future": is_future,
        })
    return {"horizon": horizon, "last_date": last_date.date().isoformat(), "seri": series}


def slug_for(cid, names):
    return names.get(cid, f"komoditas-{cid}")


def main():
    os.makedirs(OUT, exist_ok=True)
    files = [f for f in glob.glob(os.path.join(RAW_P, "*.json")) if os.path.basename(f) != "meta.json"]
    if not files:
        raise SystemExit(f"Tak ada file processed di {RAW_P}. Jalankan preprocess.py dulu.")
    for fp in sorted(files):
        d = json.load(open(fp, encoding="utf-8"))
        kom = d["komoditas"]
        result = {"komoditas": kom, "tipe_harga": d["tipe_harga"], "horizon_days": HORIZON_DAYS, "provinsi": {}}
        # kumpulkan seri per provinsi
        prov_series = {}
        for day in d["seri"]:
            for pname, v in day["data"].items():
                prov_series.setdefault(pname, {"dates": [], "prices": []})
                prov_series[pname]["dates"].append(day["tanggal"])
                prov_series[pname]["prices"].append(v["harga"])
        n_forecast = 0
        for pname, s in prov_series.items():
            # urutkan biar konsisten
            idx = sorted(range(len(s["dates"])), key=lambda i: s["dates"][i])
            dates = [s["dates"][i] for i in idx]
            prices = [s["prices"][i] for i in idx]
            # drop None
            clean = [(a, b) for a, b in zip(dates, prices) if b is not None]
            if len(clean) < MIN_POINTS:
                continue
            dc = [a for a, _ in clean]
            pc = [b for _, b in clean]
            f = forecast_province(dc, pc)
            if f:
                result["provinsi"][pname] = f
                n_forecast += 1
        opath = os.path.join(OUT, f"{kom}.json")
        with open(opath, "w", encoding="utf-8") as f:
            json.dump(result, f, ensure_ascii=False, indent=1)
        print(f"[ok] {kom}: {n_forecast} provinsi di-forecast -> {os.path.relpath(opath)}")
    print("\nSelesai. Output di data/forecast/")


if __name__ == "__main__":
    main()
