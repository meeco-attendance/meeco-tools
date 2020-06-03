/* global chrome */
(() => {
  const clickEvent = new MouseEvent("click", {
    view: window,
    bubbles: true,
    cancelable: false,
  });

  const scrollToElement = (element) => {
    window.scroll({
      top: element.getBoundingClientRect().top + window.scrollY,
      behavior: "smooth",
    });
  };

  const findAndSurfToArticle = async (url, direction) => {
    console.log(url);
    const result = await fetch(`https://meeco.kr${url}`);
    const resultHtml = await result.text();
    console.log(resultHtml);
    const dom = document.createElement("html");
    dom.innerHTML = resultHtml;

    const elements = dom.querySelectorAll(".ldn tbody tr:not(.notice)");
    console.log(elements);
    let nextElement = null;
    if (direction === "prev") {
      nextElement = elements[0];
    }
    if (direction === "next") {
      nextElement = elements[elements.length - 1];
    }
    console.log("nextElement");
    console.log(nextElement);
    if (nextElement) {
      const a = nextElement.querySelector("td.title a");
      console.log("a");
      console.log(a);
      const href = a.getAttribute("href");
      console.log("href");
      console.log(href);
      window.location.href = href;
    }
    // const posLdnStart = resultHtml.indexOf(`<div class="ldn-wrap">`);
    // const posTbodyStart = resultHtml.indexOf(`<tbody>`, posLdnStart);
    // if (direction === "prev") {
    //   const posTrStart = resultHtml.indexOf(`<tr>`, posTbodyStart);
    //   const posTitleStart = resultHtml.indexOf(`<td class="title">`, posTrStart);

    // }
    // if (direction === "next") {
    //   const posLdnEnd = resultHtml.indexOf(`</table>`, posLdnStart);
    // }
  };

  const main = () => {
    chrome.storage.sync.get(["settings"], async (data) => {
      const { settings } = data;
      if (!settings || !settings?.useHotkeys || !settings?.hotkeys) {
        return;
      }

      // const hotkeys = [
      //   { key: "nextArticle", label: "다음 글로 이동", default: "w" },
      //   { key: "prevArticle", label: "이전 글로 이동", default: "s" },
      //   { key: "voteUpArticle", label: "글 추천", default: "e" },
      //   { key: "gotoContent", label: "글 영역으로 이동", default: "a" },
      //   { key: "gotoComments", label: "댓글 영역으로 이동", default: "d" },
      // ];

      const { hotkeys } = settings;
      window.addEventListener("keydown", (event) => {
        Object.keys(hotkeys).forEach((key) => {
          if (event.key === hotkeys[key].binded && hotkeys[key].enabled) {
            if (key === "voteUpArticle") {
              const element = document.querySelector(".atc-vote-bt.up");
              element.dispatchEvent(clickEvent);
            }
            if (key === "nextArticle") {
              const elements = document.querySelectorAll(
                ".ldn tbody tr:not(.notice)"
              );
              let itWorked = false;
              elements.forEach((element, index) => {
                if (itWorked) return;
                if (element.classList.contains("on")) {
                  const nextElement = elements[index - 1];
                  console.log(index);
                  console.log(nextElement);
                  if (nextElement) {
                    nextElement
                      .querySelector("td.title a")
                      .dispatchEvent(clickEvent);
                    itWorked = true;
                  }
                }
              });
              if (!itWorked) {
                const pagingElements = document.querySelectorAll(
                  ".paging.bBt a.pageNum.num"
                );
                pagingElements.forEach((element, index) => {
                  if (itWorked) return;
                  if (element.classList.contains("on")) {
                    const nextElement = pagingElements[index - 1];
                    if (nextElement) {
                      const url = nextElement.getAttribute("href");
                      findAndSurfToArticle(url, "next");
                    }
                  }
                });
              }
            }
            if (key === "prevArticle") {
              const elements = document.querySelectorAll(
                ".ldn tbody tr:not(.notice)"
              );
              let itWorked = false;
              elements.forEach((element, index) => {
                if (itWorked) return;
                if (element.classList.contains("on")) {
                  const nextElement = elements[index + 1];
                  if (nextElement) {
                    nextElement
                      .querySelector("td.title a")
                      .dispatchEvent(clickEvent);
                    itWorked = true;
                  }
                }
              });
              if (!itWorked) {
                const pagingElements = document.querySelectorAll(
                  ".paging.bBt a.pageNum.num"
                );
                pagingElements.forEach((element, index) => {
                  if (itWorked) return;
                  if (element.classList.contains("on")) {
                    const nextElement = pagingElements[index + 1];
                    if (nextElement) {
                      const url = nextElement.getAttribute("href");
                      findAndSurfToArticle(url, "prev");
                    }
                  }
                });
              }
            }
            if (key === "gotoComments") {
              const element = document.querySelector(".bCmt-hd");
              scrollToElement(element);
            }
            if (key === "gotoContent") {
              const element = document.querySelector(".atc-hd");
              scrollToElement(element);
            }
          }
        });
      });
    });
  };

  main();
})();
