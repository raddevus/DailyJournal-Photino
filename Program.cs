using PhotinoNET;
using System;
using System.Drawing;
using System.IO;
using System.Text;
using System.Text.Json;

namespace HelloPhotinoApp
{
    class Program
    {
        [STAThread]
        static void Main(string[] args)
        {
            // Window title declared here for visibility
            string windowTitle = "DailyJournal - save your work notes";

            // Creating a new PhotinoWindow instance with the fluent API
            var window = new PhotinoWindow()
                .SetTitle(windowTitle)
                // Resize to a percentage of the main monitor work area
                .SetUseOsDefaultSize(false)
                .SetSize(new Size(600, 400))
                // Center window in the middle of the screen
                .Center()
                // Users can resize windows by default.
                .SetResizable(true)
                // Most event handlers can be registered after the
                // PhotinoWindow was instantiated by calling a registration 
                // method like the following RegisterWebMessageReceivedHandler.
                // This could be added in the PhotinoWindowOptions if preferred.
                .RegisterWebMessageReceivedHandler((object? sender, string message) => {
                    var window = sender as PhotinoWindow;

                    if (message == null){
                        return;
                    }
                    
                    WindowMessage? wm = JsonSerializer.Deserialize<WindowMessage>(message);

                    if (wm == null){
                        return;
                    }
                    
                    switch(wm.Command){
                        case "createYMDir":{
                            var currentDir = Environment.CurrentDirectory;
                            Directory.CreateDirectory(Path.Combine(currentDir,DateTime.Now.ToString("yyyy-MM")));
                            break;
                        }
                        case "getCurrentDirectory":{
                            wm.Parameters = Environment.CurrentDirectory;
                            window?.SendWebMessage(JsonSerializer.Serialize(wm));
                            break;
                        }
                        case "getUserProfile":{
                            wm.Parameters = Environment.GetFolderPath(Environment.SpecialFolder.UserProfile);
                            window?.SendWebMessage(JsonSerializer.Serialize(wm));
                            break;
                        }
                        case "saveEntryData":{
                            var entry = new Entry( wm.AllParameters[0], wm.AllParameters[1]);
                            entry.Save();
                            break;
                        }
                        default :{
                            // The message argument is coming in from sendMessage.
                            // "window.external.sendMessage(message: string)"
                            wm.Parameters = $"Received message: \"{wm.Parameters}\"";

                            // Send a message back the to JavaScript event handler.
                            // "window.external.receiveMessage(callback: Function)"
                            window?.SendWebMessage(JsonSerializer.Serialize(wm));
                                break;
                            }
                    }
                })
                .Load("wwwroot/index.html"); // Can be used with relative path strings or "new URI()" instance to load a website.

            window.WaitForClose(); // Starts the application event loop
        }
    }
}
