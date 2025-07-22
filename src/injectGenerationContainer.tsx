import { createRoot } from 'react-dom/client';
import GenerationContainer from './GenerationContainer';

if (!document.getElementById('generation-container-root')) {
  chrome.runtime.onMessage.addListener(async (message: any) => {
    if (message.action === 'show-generation-container') {
      const event = new CustomEvent("show-generation-container", {
        detail: {
          jobPosting: message.jobPosting || "",
          documentType: message.documentType || "cover-letter",
        },
      });
      window.dispatchEvent(event);
    }
  });

  const rootDiv = document.createElement('div');
  rootDiv.id = 'generation-container-root';
  document.body.appendChild(rootDiv);
  const root = createRoot(rootDiv);
  root.render(<GenerationContainer />);
}
