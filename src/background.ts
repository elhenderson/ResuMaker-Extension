// @ts-nocheck
import { customFetch } from "./customFetch";

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
  tabId: string,
  info: chrome.contextMenus.OnClickData
) => {
    const authToken = await chrome.storage.local.get(["token"]);

    const res = !authToken.token ?
      await customFetch('/authenticate', {
        method: 'GET',
      }) :
      await customFetch('/authenticate', {
        method: 'GET',
        headers: {
          'Authorization': authToken.token
        }
      })
    if (res.status === 401) {
      chrome.tabs.sendMessage(tabId, {
        action: "login-required",
      });
    }
  
    if (res.status === 200) {
      //@ts-ignore
      chrome.storage.local.set({ token: res.headers.get("Authorization") });
      chrome.tabs.sendMessage(tabId, {
        action: "show-generation-container",
        // jobPosting: info.selectionText,
        documentType: documentType,
      });
    }
}

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  let documentType: "cover-letter" | "resume";

  if (info.menuItemId === "generate-cover-letter" && tab && tab.id) {
    sendMessages("cover-letter", tab.id, info);
  }

  if (info.menuItemId === "generate-resume" && tab && tab.id) {
    sendMessages("resume", tab.id, info);
  }
});
