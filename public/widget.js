(function() {
  const config = window.CHATFLOW_CONFIG || {};
  const chatbotId = config.chatbotId;
  const baseUrl = config.baseUrl || window.location.origin;

  if (!chatbotId) return console.error("ChatFlow: chatbotId is required");

  // Create widget UI
  const container = document.createElement('div');
  container.id = 'chatflow-widget';
  container.style.position = 'fixed';
  container.style.bottom = '20px';
  container.style.right = '20px';
  container.style.zIndex = '9999';
  
  const button = document.createElement('button');
  button.innerHTML = '💬';
  button.style.width = '60px';
  button.style.height = '60px';
  button.style.borderRadius = '50%';
  button.style.backgroundColor = '#4f46e5';
  button.style.color = 'white';
  button.style.border = 'none';
  button.style.cursor = 'pointer';
  button.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
  button.style.fontSize = '24px';
  
  const iframe = document.createElement('iframe');
  iframe.src = `${baseUrl}/chatbots/${chatbotId}/chat?embed=true`;
  iframe.style.display = 'none';
  iframe.style.width = '400px';
  iframe.style.height = '600px';
  iframe.style.border = 'none';
  iframe.style.borderRadius = '20px';
  iframe.style.boxShadow = '0 8px 32px rgba(0,0,0,0.2)';
  iframe.style.marginBottom = '20px';
  
  button.onclick = () => {
    if (iframe.style.display === 'none') {
      iframe.style.display = 'block';
      button.innerHTML = '✕';
    } else {
      iframe.style.display = 'none';
      button.innerHTML = '💬';
    }
  };
  
  container.appendChild(iframe);
  container.appendChild(button);
  document.body.appendChild(container);

  // Handle mobile
  if (window.innerWidth < 640) {
    iframe.style.width = 'calc(100vw - 40px)';
    iframe.style.height = 'calc(100vh - 100px)';
  }
})();
