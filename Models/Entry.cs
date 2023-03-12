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
        File.AppendAllText(Path.Combine(EntryFolder,EntryFile),Data);
        }
        catch{
            return false;
        }
        return true;
    }

    public String Read(){
        try{
            return File.ReadAllText(Path.Combine(EntryFolder,EntryFile));
        }
        catch{Console.WriteLine($"couldn't read data from {Path.Combine(EntryFolder,EntryFile)} ");
        return String.Empty;}
    }
}