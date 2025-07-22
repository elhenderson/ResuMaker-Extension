

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "generate-cover-letter",
    title: "Generate Cover Letter",
    contexts: ["selection"]
  });

  chrome.contextMenus.create({
    id: "generate-resume",
    title: "Generate Resume",
    contexts: ["selection"],
  });
});

const sendMessages = async (
  documentType: "cover-letter" | "resume",
  tabId: number,
  info: chrome.contextMenus.OnClickData
) => {
  chrome.tabs.sendMessage(tabId, {
    action: "show-generation-container",
    jobPosting: info.selectionText,
    documentType: documentType,
  });
}

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "generate-cover-letter" && tab && tab.id) {
    sendMessages("cover-letter", tab.id, info);
  }

  if (info.menuItemId === "generate-resume" && tab && tab.id) {
    sendMessages("resume", tab.id, info);
  }
});
