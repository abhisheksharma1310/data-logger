import React from "react";

const useSpin = (loading = false, loadingPercent = "auto") => {
  const [spinning, setSpinning] = React.useState(loading);
  const [percent, setPercent] = React.useState(loadingPercent);
  const showLoader = (load) => {
    setSpinning(load);
    // let ptg = -10;
    // const interval = setInterval(() => {
    //   ptg += 5;
    //   setPercent(ptg);
    //   if (ptg > 120) {
    //     clearInterval(interval);
    //     setSpinning(false);
    //     setPercent(0);
    //   }
    // }, 100);
  };
  return [showLoader, spinning, percent];
};
export default useSpin;
