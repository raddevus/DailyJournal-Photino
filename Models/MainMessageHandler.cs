using PhotinoNET;
using System.Text.Json;

public class MainMessageHandler{
    static public void MessageHandler(object? sender, string message) 
     {
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
    }
}