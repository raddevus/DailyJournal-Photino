class Entry{
    public String Data{get;set;}
    public DateTime Created{get;set;}

    public String EntryFolder{get;set;}

    public String EntryFile{get;set;}
    public Entry(String date, String data)
    {
        try{
            Created = DateTime.Parse(date);
        }
        catch{
            Console.WriteLine("couldn't parse entry date");
        }
        EntryFolder = Created.ToString("yyyy-MM");
        EntryFile = $"{Created.ToString("yyyy-MM-dd")}.txt";
        Data = data;
    }

    public bool Save(){
        try{
            Directory.CreateDirectory(EntryFolder);
            var targetFile = Path.Combine(EntryFolder,EntryFile);
            File.Delete(targetFile);
            File.AppendAllText(targetFile,Data);
        }
        catch{
            return false;
        }
        return true;
    }

    public String Read(){
        try{
            var currentDateFile = Path.Combine(EntryFolder,EntryFile);
            if (File.Exists(currentDateFile)){
                return File.ReadAllText(currentDateFile);
            }
            Console.WriteLine($"An entry doesn't exist yet for {Path.Combine(EntryFolder,EntryFile)} ");
            return String.Empty;
        }
        catch{Console.WriteLine($"couldn't read data from {Path.Combine(EntryFolder,EntryFile)} ");
        return String.Empty;}
    }
}