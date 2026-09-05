export default function TerraceBackdrop({ idPrefix = "hero" }: { idPrefix?: string }) {
  return (
    <svg viewBox="0 0 1600 960" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id={`${idPrefix}-terrace-front`} x1=".1" y1="1" x2=".8" y2=".1"><stop stopColor="#cbded7" /><stop offset=".55" stopColor="#e9f1ed" /><stop offset="1" stopColor="#f9fbfa" /></linearGradient>
        <linearGradient id={`${idPrefix}-terrace-back`} x1="1" y1=".9" x2=".35" y2=".15"><stop stopColor="#ccdad5" /><stop offset=".65" stopColor="#edf3f0" /><stop offset="1" stopColor="#f8faf9" /></linearGradient>
        <linearGradient id={`${idPrefix}-terrace-edge`} x1="0" y1="1" x2="1" y2="0"><stop stopColor="#f9fbfa" /><stop offset=".5" stopColor="#dce9e3" /><stop offset="1" stopColor="#eef4f1" /></linearGradient>
      </defs>
      <path d="M1080-80C1110 160 1300 185 1307 375C1315 588 997 655 835 772C735 845 709 918 737 1010H1710V-80Z" fill={`url(#${idPrefix}-terrace-back)`} />
      <path d="M1200-80C1209 140 1425 214 1398 399C1365 624 1123 680 951 800C860 864 825 932 842 1010" stroke="#ffffff" strokeWidth="3" fill="none" />
      <path d="M1320-80C1323 133 1556 236 1489 442C1422 647 1273 712 1117 827C1055 873 1010 945 1018 1010" stroke="#f8fcfa" strokeWidth="2" fill="none" />
      <path d="M-110 391C55 455 104 325 230 402C373 489 205 650 359 730C520 813 713 729 814 820C882 880 860 963 890 1020H-110Z" fill={`url(#${idPrefix}-terrace-front)`} />
      <path d="M-110 459C57 526 115 402 206 469C299 537 162 679 307 781C471 896 683 797 759 883C798 927 787 982 817 1020" stroke="#ffffff" strokeWidth="3" fill="none" />
      <path d="M-110 555C67 622 113 483 180 545C234 595 113 727 250 827C390 929 578 880 650 955C667 973 674 999 681 1020" stroke="#fafffc" strokeWidth="2" fill="none" />
      <path d="M-90 777C106 689 174 905 397 885C624 864 666 1011 832 993L907 1060H-90Z" fill={`url(#${idPrefix}-terrace-edge)`} />
    </svg>
  );
}

