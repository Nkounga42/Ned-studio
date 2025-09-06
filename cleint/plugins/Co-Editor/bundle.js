// Simple plugin bundle compatible with our loader
(function() {
  const HelloWorldPlugin = () => {
    const [count, setCount] = React.useState(0);
    const [appVersion, setAppVersion] = React.useState("");
    
    const handleNotification = async () => {
      await pluginAPI.showNotification(`Hello from plugin! Count: ${count}`, "info");
    };
    
    const handleGetVersion = async () => {
      const version = await pluginAPI.getAppVersion();
      setAppVersion(version);
      await pluginAPI.showNotification(`App version: ${version}`, "success");
    };
    
    const handleOpenDialog = async () => {
      const result = await pluginAPI.openDialog({
        title: "Select a file",
        properties: ["openFile"],
        filters: [
          { name: "Text Files", extensions: ["txt"] },
          { name: "All Files", extensions: ["*"] }
        ]
      });
      
      if (!result.canceled && result.filePaths.length > 0) {
        await pluginAPI.showNotification(`Selected: ${result.filePaths[0]}`, "info");
      }
    };

    return React.createElement("div", { 
      style: { padding: "20px", fontFamily: "Arial, sans-serif" } 
    }, 
      React.createElement("h1", { 
        style: { color: "#333", marginBottom: "20px" } 
      }, "🌍 Hello World Plugin"),
      
      React.createElement("div", { 
        style: { marginBottom: "20px" } 
      }, 
        React.createElement("p", null, "This is a simple example plugin demonstrating:"),
        React.createElement("ul", null,
          React.createElement("li", null, "React component rendering"),
          React.createElement("li", null, "Plugin API usage"),
          React.createElement("li", null, "State management"),
          React.createElement("li", null, "Electron dialog integration")
        )
      ),

      React.createElement("div", { 
        style: { display: "flex", flexDirection: "column", gap: "10px", maxWidth: "300px" } 
      },
        React.createElement("button", {
          onClick: () => setCount(count + 1),
          style: {
            background: "#007acc",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "4px",
            cursor: "pointer"
          }
        }, `Count: ${count}`),

        React.createElement("button", {
          onClick: handleNotification,
          style: {
            background: "#28a745",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "4px",
            cursor: "pointer"
          }
        }, "Show Notification"),

        React.createElement("button", {
          onClick: handleGetVersion,
          style: {
            background: "#17a2b8",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "4px",
            cursor: "pointer"
          }
        }, "Get App Version"),

        React.createElement("button", {
          onClick: handleOpenDialog,
          style: {
            background: "#ffc107",
            color: "#212529",
            border: "none",
            padding: "8px 16px",
            borderRadius: "4px",
            cursor: "pointer"
          }
        }, "Open File Dialog")
      ),

      appVersion && React.createElement("div", {
        style: { marginTop: "20px", padding: "10px", background: "#f8f9fa", borderRadius: "4px" }
      },
        React.createElement("strong", null, "App Version: "),
        appVersion
      ),

      React.createElement("div", {
        style: { marginTop: "30px", fontSize: "14px", color: "#666" }
      },
        React.createElement("p", null, "Plugin ID: hello-world"),
        React.createElement("p", null, "Version: 1.0.0")
      )
    );
  };

  // Export the component
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = HelloWorldPlugin;
  } else {
    window.HelloWorldPlugin = HelloWorldPlugin;
  }
})();
