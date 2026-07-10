package com.lab.util;

import java.io.*;
import java.nio.file.*;
import java.util.*;
import java.util.regex.*;

public class DBConnection {
    
    public static String readDB() {
        try {
            File f = getDatabaseFile();
            if (f.exists()) {
                return new String(Files.readAllBytes(Paths.get(f.getAbsolutePath())));
            }
            return "{}";
        } catch (Exception e) {
            e.printStackTrace();
            return "{}";
        }
    }

    public static void writeDB(String jsonContent) {
        try {
            File f = getDatabaseFile();
            Files.write(Paths.get(f.getAbsolutePath()), jsonContent.getBytes());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    private static File getDatabaseFile() {
        // 1. Check in Tomcat's webapps/ROOT/
        String catalinaBase = System.getProperty("catalina.base");
        if (catalinaBase != null) {
            File f1 = new File(catalinaBase, "webapps/ROOT/database.json");
            if (f1.exists()) return f1;
        }
        
        // 2. Check in current directory
        File f2 = new File("database.json");
        if (f2.exists()) return f2;
        
        // 3. Fallback absolute paths (if the user puts it in C:)
        File f3 = new File("C:/database.json");
        if (f3.exists()) return f3;
        
        // Default to webapps/ROOT/database.json if it needs to create one
        if (catalinaBase != null) {
            return new File(catalinaBase, "webapps/ROOT/database.json");
        }
        
        return f2;
    }
}
