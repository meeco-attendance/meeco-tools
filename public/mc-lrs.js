/* global chrome */
(() => {
  const injectCss = (styleString) => {
    const style = document.createElement("style");
    style.textContent = styleString;
    document.head.append(style);
  };

  const main = () => {
    chrome.storage.sync.get(["settings"], async (data) => {
      if (data && data.settings && data.settings.useLowResolutionSupport) {
        console.log("hell!!!!!!!!!!!!!!!!!!!!!!!!!!!o");
        injectCss(`
        *{
          box-sizing: border-box;
        }
        .cLogged{
          width: 100%; height: auto;
          position: relative;
          display: flex;
          flex-direction: row;
          padding-top: 0;
          padding-left: 0;
          padding: 8px 0;
          align-items: center;
        }
        .cLogged *{
          position: relative !important;
          left: unset !important;
          top: unset !important;
          bottom: unset !important;
          right: unset !important;
        }
        .cLogged a{
          padding: 0 8px;
        }
        .cLogged .bt-logout{
          padding: 0;
          margin-top: 0px !important;
          margin-left: auto;
        }
        .cHd-wrap,
        .cHd-img img,
        .cFt-wrap,
        .cCtn	{width: 100%;max-width: 100vw;min-width: unset;}
        .cHd	{width: 100%; height: 54px;min-width: unset;}
        .cHd-logo	{width: 54px; height: 54px;}
        .wrapper	{
            width: 100%;
            display: flex;
            flex-direction: row;}
        .sidebar1	{width: unset; flex: 16; max-width: 200px}
        .sidebar2	{width: 18%; flex: 20; max-width: 250px}
        .sidebar2.hided	{right: -271px;}
        .fg-sb1	{left: 200px;}
        .fg-sb2	{right: 270px;}
        .cn-list	{width: 271px;}
        .cCon	{width: unset;flex:64;}
        .cCon>div{
        width: 100% !important;
        }
        .cFt	{width: 100%;}
        .fg-wrap	{width: 100%; margin-left: -50%}
        .fg-con	{left: 200px; width: 879px;}
        .ellipsis-meeco {display:inline-block; width:90%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;}
        .right-float {float:right; margin-right: 10px;}
        .bt-area.dis-cell{padding-right: 16px;}`);
      }
    });
  };

  main();
})();
