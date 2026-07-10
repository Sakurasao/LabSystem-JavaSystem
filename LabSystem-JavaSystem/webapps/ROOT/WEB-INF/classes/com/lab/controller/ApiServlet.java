package com.lab.controller;

import com.google.gson.*;
import com.lab.util.DBConnection;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.*;
import java.util.*;

public class ApiServlet extends HttpServlet {

    private Gson gson = new Gson();

    private JsonObject getDb() {
        return JsonParser.parseString(DBConnection.readDB()).getAsJsonObject();
    }

    private void saveDb(JsonObject db) {
        DBConnection.writeDB(gson.toJson(db));
    }

    private void sendJson(HttpServletResponse resp, Object data) throws IOException {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        PrintWriter out = resp.getWriter();
        out.print(gson.toJson(data));
        out.flush();
    }
    
    private void sendError(HttpServletResponse resp, int status, String msg) throws IOException {
        resp.setStatus(status);
        JsonObject err = new JsonObject();
        err.addProperty("success", false);
        err.addProperty("message", msg);
        sendJson(resp, err);
    }
    
    private JsonObject parseBody(HttpServletRequest req) throws IOException {
        StringBuilder sb = new StringBuilder();
        String line;
        BufferedReader reader = req.getReader();
        while ((line = reader.readLine()) != null) {
            sb.append(line);
        }
        return JsonParser.parseString(sb.toString()).getAsJsonObject();
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String pathInfo = req.getPathInfo();
        if (pathInfo == null) pathInfo = "/";
        JsonObject db = getDb();
        
        if (pathInfo.equals("/labs")) {
            JsonElement lab = db.get("t_lab");
            sendJson(resp, lab != null ? lab : new JsonArray());
        } else if (pathInfo.equals("/pcs")) {
            String idLab = req.getParameter("id_lab");
            JsonArray pcs = db.getAsJsonArray("t_pc");
            if (pcs == null) pcs = new JsonArray();
            if (idLab != null && !idLab.isEmpty()) {
                JsonArray filtered = new JsonArray();
                for (JsonElement e : pcs) {
                    if (e.getAsJsonObject().get("id_lab").getAsString().equals(idLab)) {
                        filtered.add(e);
                    }
                }
                sendJson(resp, filtered);
            } else {
                sendJson(resp, pcs);
            }
        } else if (pathInfo.equals("/peminjaman")) {
            JsonElement pem = db.get("t_peminjaman");
            sendJson(resp, pem != null ? pem : new JsonArray());
        } else if (pathInfo.equals("/history")) {
            JsonElement hist = db.get("t_audit_log");
            sendJson(resp, hist != null ? hist : new JsonArray());
        } else if (pathInfo.equals("/reports/summary")) {
            // Simplified reporting
            JsonObject report = new JsonObject();
            report.addProperty("totalPinjam", db.getAsJsonArray("t_peminjaman").size());
            report.addProperty("labTerpopuler", "Lab AI");
            report.addProperty("pcTerpopuler", "PC-01");
            report.add("peminjaman", db.getAsJsonArray("t_peminjaman"));
            sendJson(resp, report);
        } else {
            sendError(resp, 404, "Not found");
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String pathInfo = req.getPathInfo();
        if (pathInfo == null) pathInfo = "/";
        JsonObject db = getDb();
        
        try {
            if (pathInfo.equals("/auth/login")) {
                JsonObject body = parseBody(req);
                String nim = body.has("nim") ? body.get("nim").getAsString() : "";
                String pwd = body.has("password") ? body.get("password").getAsString() : "";
                
                boolean isAdmin = body.has("isAdmin") && body.get("isAdmin").getAsBoolean();
                
                if (isAdmin) {
                    // Admin login
                    if (nim.equals("admin") && pwd.equals("admin")) {
                        JsonObject admin = new JsonObject();
                        admin.addProperty("nim", "admin");
                        admin.addProperty("nama", "Administrator");
                        admin.addProperty("role", "ADMIN"); // or ASLAB, depending on what the frontend wants. But let's keep ADMIN if it expects it.
                        JsonObject res = new JsonObject();
                        res.addProperty("success", true);
                        res.addProperty("message", "Login Admin berhasil");
                        res.add("user", admin);
                        sendJson(resp, res);
                        return;
                    }
                    
                                        // Aslab login
                    JsonArray aslab = db.getAsJsonArray("t_aslab");
                    if (aslab != null) {
                        for (JsonElement e : aslab) {
                            JsonObject m = e.getAsJsonObject();
                            String mNim = m.has("nim") ? m.get("nim").getAsString() : "";
                            String mId = m.has("id_aslab") ? m.get("id_aslab").getAsString() : "";
                            String mPwd = m.has("password") ? m.get("password").getAsString() : "";
                            if ((mNim.equals(nim) || mId.equals(nim)) && mPwd.equals(pwd)) {
                                JsonObject user = new JsonObject();
                                user.addProperty("nim", nim);
                                user.addProperty("nama", m.get("nama").getAsString());
                                user.addProperty("role", "ASLAB");
                                JsonObject res = new JsonObject();
                                res.addProperty("success", true);
                                res.addProperty("message", "Login Aslab berhasil");
                                res.add("user", user);
                                sendJson(resp, res);
                                return;
                            }
                        }
                    }
                    
                    // Fallback to t_mahasiswa for prototype ASLAB login
                    if ("aslab".equals(pwd)) {
                        JsonArray mhs = db.getAsJsonArray("t_mahasiswa");
                        if (mhs != null) {
                            for (JsonElement e : mhs) {
                                JsonObject m = e.getAsJsonObject();
                                if (m.get("nim").getAsString().equals(nim)) {
                                    JsonObject user = new JsonObject();
                                    user.addProperty("nim", nim);
                                    user.addProperty("nama", m.get("nama").getAsString());
                                    user.addProperty("role", "ASLAB");
                                    JsonObject res = new JsonObject();
                                    res.addProperty("success", true);
                                    res.addProperty("message", "Login Aslab berhasil");
                                    res.add("user", user);
                                    sendJson(resp, res);
                                    return;
                                }
                            }
                        }
                    }
                    sendError(resp, 401, "NIM atau Password Admin salah");
                } else {
                    // Student login
                    JsonArray mhs = db.getAsJsonArray("t_mahasiswa");
                    if (mhs != null) {
                        for (JsonElement e : mhs) {
                            JsonObject m = e.getAsJsonObject();
                            if (m.get("nim").getAsString().equals(nim)) {
                                // If student is logging in via normal page, we make sure they get role STUDENT,
                                // even if they are in the database with role ASLAB, because the normal page is for borrowing.
                                // Wait, the UI expects r.role === "STUDENT" for normal users.
                                JsonObject user = m.deepCopy();
                                user.addProperty("role", "STUDENT");
                                JsonObject res = new JsonObject();
                                res.addProperty("success", true);
                                res.addProperty("message", "Login berhasil");
                                res.add("user", user);
                                sendJson(resp, res);
                                return;
                            }
                        }
                    }
                    sendError(resp, 401, "NIM tidak ditemukan");
                }
                
            } else if (pathInfo.equals("/peminjaman")) {
                JsonObject body = parseBody(req);
                JsonArray peminjaman = db.getAsJsonArray("t_peminjaman");
                if (peminjaman == null) {
                    peminjaman = new JsonArray();
                    db.add("t_peminjaman", peminjaman);
                }
                body.addProperty("id_pinjam", "PJ-" + System.currentTimeMillis());
                body.addProperty("status", "PENDING");
                peminjaman.add(body);
                
                String targetPc = (body.has("id_pc") && !body.get("id_pc").isJsonNull()) ? body.get("id_pc").getAsString() : null;
                if (targetPc != null) {
                    JsonArray pcs = db.getAsJsonArray("t_pc");
                    if (pcs != null) {
                        for (com.google.gson.JsonElement e : pcs) {
                            JsonObject pc = e.getAsJsonObject();
                            if (pc.has("id_pc") && !pc.get("id_pc").isJsonNull() && pc.get("id_pc").getAsString().equals(targetPc)) {
                                pc.addProperty("status", "OCCUPIED");
                            }
                        }
                    }
                }
                
                saveDb(db);
                
                JsonObject res = new JsonObject();
                res.addProperty("success", true);
                res.addProperty("message", "Peminjaman berhasil diajukan");
                sendJson(resp, res);
                
            } else if (pathInfo.startsWith("/pcs/") && pathInfo.endsWith("/force-release")) {
                String id = pathInfo.split("/")[2];
                JsonArray pcs = db.getAsJsonArray("t_pc");
                for (JsonElement e : pcs) {
                    JsonObject pc = e.getAsJsonObject();
                    if (pc.get("id_pc").getAsString().equals(id)) {
                        pc.addProperty("status", "AVAILABLE");
                    }
                }
                saveDb(db);
                JsonObject res = new JsonObject();
                res.addProperty("success", true);
                res.addProperty("message", "PC direlease");
                sendJson(resp, res);
                
            } else if (pathInfo.startsWith("/pcs/") && pathInfo.endsWith("/shutdown")) {
                String id = pathInfo.split("/")[2];
                JsonObject body = parseBody(req);
                String alasan = body.has("alasan") ? body.get("alasan").getAsString() : "Terdeteksi Bermain Game / Pelanggaran Penggunaan";
                
                JsonArray pcs = db.getAsJsonArray("t_pc");
                for (JsonElement e : pcs) {
                    JsonObject pc = e.getAsJsonObject();
                    if (pc.get("id_pc").getAsString().equals(id)) {
                        pc.addProperty("status", "OFFLINE");
                    }
                }
                
                JsonArray peminjaman = db.getAsJsonArray("t_peminjaman");
                if (peminjaman != null) {
                    for (JsonElement e : peminjaman) {
                        JsonObject p = e.getAsJsonObject();
                        if (p.has("id_pc") && !p.get("id_pc").isJsonNull() && p.get("id_pc").getAsString().equals(id)) {
                            String pStatus = p.has("status") ? p.get("status").getAsString() : "PENDING";
                            if ("APPROVED".equals(pStatus) || "PENDING".equals(pStatus)) {
                                p.addProperty("status", "REJECTED");
                                String oldKeperluan = p.has("keperluan") ? p.get("keperluan").getAsString() : "";
                                p.addProperty("keperluan", oldKeperluan + " (DIMATIKAN OLEH ASLAB: " + alasan + ")");
                            }
                        }
                    }
                }
                
                saveDb(db);
                JsonObject res = new JsonObject();
                res.addProperty("success", true);
                res.addProperty("message", "PC berhasil dimatikan dan sesi dihentikan");
                sendJson(resp, res);
                
            } else if (pathInfo.equals("/pcs/mass-update")) {
                JsonObject body = parseBody(req);
                JsonArray ids = body.getAsJsonArray("ids");
                String status = body.get("status").getAsString();
                
                JsonArray pcs = db.getAsJsonArray("t_pc");
                for (JsonElement e : pcs) {
                    JsonObject pc = e.getAsJsonObject();
                    for(JsonElement selectedId : ids) {
                        if (pc.get("id_pc").getAsString().equals(selectedId.getAsString())) {
                            pc.addProperty("status", status);
                        }
                    }
                }
                saveDb(db);
                JsonObject res = new JsonObject();
                res.addProperty("success", true);
                res.addProperty("message", "Mass update berhasil");
                sendJson(resp, res);
                
            } else if (pathInfo.equals("/ping/all")) {
                // Simulate ping
                JsonObject body = com.google.gson.JsonParser.parseReader(req.getReader()).getAsJsonObject();
                String idLab = body.get("id_lab").getAsString();
                
                JsonArray pcs = db.getAsJsonArray("t_pc");
                JsonArray results = new JsonArray();
                
                for (com.google.gson.JsonElement el : pcs) {
                    JsonObject pc = el.getAsJsonObject();
                    if (pc.get("id_lab").getAsString().equals(idLab)) {
                        JsonObject pingRes = new JsonObject();
                        pingRes.addProperty("id_pc", pc.get("id_pc").getAsString());
                        pingRes.addProperty("no_pc", pc.get("no_pc").getAsInt());
                        pingRes.addProperty("ip_address", "192.168.1." + (100 + pc.get("no_pc").getAsInt()));
                        
                        // random latency 5-50ms
                        int latency = 5 + (int)(Math.random() * 45);
                        
                        // Set status based on latency or randomly
                        String status = "ONLINE";
                        double downloadSpeed = 0.0;
                        double uploadSpeed = 0.0;
                        
                        if (Math.random() < 0.1) {
                            status = "OFFLINE";
                            latency = 0;
                        } else if (latency > 35) {
                            status = "SLOW";
                            latency = 120 + (int)(Math.random() * 100); // 120 - 220 ms
                            if (Math.random() < 0.5) {
                                // SLOW (Red) - download speed < 1.0 Mbps
                                downloadSpeed = Math.round((Math.random() * 0.7 + 0.2) * 10.0) / 10.0;
                            } else {
                                // MODERATE (Yellow) - download speed 1.5 - 6.0 Mbps
                                downloadSpeed = Math.round((Math.random() * 4.5 + 1.5) * 10.0) / 10.0;
                            }
                            uploadSpeed = Math.round((Math.random() * 2 + 0.5) * 10.0) / 10.0;
                        } else {
                            status = "ONLINE";
                            downloadSpeed = Math.round((Math.random() * 100 + 50) * 10.0) / 10.0;
                            uploadSpeed = Math.round((Math.random() * 50 + 20) * 10.0) / 10.0;
                        }
                        
                        pingRes.addProperty("status_ping", status);
                        pingRes.addProperty("downloadSpeed", downloadSpeed);
                        pingRes.addProperty("uploadSpeed", uploadSpeed);
                        pingRes.addProperty("latency", latency);
                        results.add(pingRes);
                    }
                }
                
                JsonObject res = new JsonObject();
                res.addProperty("success", true);
                res.add("pingResults", results);
                sendJson(resp, res);
            } else {
                sendError(resp, 404, "Not found");
            }
        } catch(Exception e) {
            e.printStackTrace();
            sendError(resp, 500, e.getMessage());
        }
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String pathInfo = req.getPathInfo();
        if (pathInfo == null) pathInfo = "/";
        JsonObject db = getDb();
        
        try {
            if (pathInfo.startsWith("/peminjaman/") && pathInfo.endsWith("/status")) {
                String id = pathInfo.split("/")[2];
                JsonObject body = parseBody(req);
                String status = (body.has("status") && !body.get("status").isJsonNull()) ? body.get("status").getAsString() : "PENDING";
                
                JsonArray peminjaman = db.getAsJsonArray("t_peminjaman");
                if (peminjaman == null) peminjaman = new JsonArray();
                String targetPc = null;
                for (com.google.gson.JsonElement e : peminjaman) {
                    JsonObject p = e.getAsJsonObject();
                    if (p.has("id_pinjam") && !p.get("id_pinjam").isJsonNull() && p.get("id_pinjam").getAsString().equals(id)) {
                        p.addProperty("status", status);
                        if (p.has("id_pc") && !p.get("id_pc").isJsonNull()) {
                            targetPc = p.get("id_pc").getAsString();
                        }
                    }
                }
                
                if (targetPc != null && ("REJECTED".equals(status) || "SELESAI".equals(status) || "DONE".equals(status) || "COMPLETED".equals(status))) {
                    JsonArray pcs = db.getAsJsonArray("t_pc");
                    if (pcs != null) {
                        for (com.google.gson.JsonElement e : pcs) {
                            JsonObject pc = e.getAsJsonObject();
                            if (pc.has("id_pc") && !pc.get("id_pc").isJsonNull() && pc.get("id_pc").getAsString().equals(targetPc)) {
                                pc.addProperty("status", "AVAILABLE");
                            }
                        }
                    }
                }
                
                saveDb(db);
                JsonObject res = new JsonObject();
                res.addProperty("success", true);
                res.addProperty("message", "Status updated");
                sendJson(resp, res);
                
            } else if (pathInfo.startsWith("/peminjaman/") && pathInfo.endsWith("/extend")) {
                String id = pathInfo.split("/")[2];
                JsonObject body = parseBody(req);
                int additionalHours = body.has("hours") ? body.get("hours").getAsInt() : 1;
                String alasan = body.has("alasan") ? body.get("alasan").getAsString() : "";
                
                JsonArray peminjaman = db.getAsJsonArray("t_peminjaman");
                if (peminjaman == null) peminjaman = new JsonArray();
                boolean found = false;
                for (com.google.gson.JsonElement e : peminjaman) {
                    JsonObject p = e.getAsJsonObject();
                    if (p.has("id_pinjam") && !p.get("id_pinjam").isJsonNull() && p.get("id_pinjam").getAsString().equals(id)) {
                        String oldSelesai = p.has("jam_selesai") ? p.get("jam_selesai").getAsString() : "10:00";
                        try {
                            String[] parts = oldSelesai.split(":");
                            int hour = Integer.parseInt(parts[0]);
                            int min = Integer.parseInt(parts[1]);
                            hour = (hour + additionalHours) % 24;
                            String newSelesai = String.format("%02d:%02d", hour, min);
                            p.addProperty("jam_selesai", newSelesai);
                            p.addProperty("alasan_perpanjangan", alasan);
                            String oldKeperluan = p.has("keperluan") ? p.get("keperluan").getAsString() : "";
                            p.addProperty("keperluan", oldKeperluan + " (Diperpanjang " + additionalHours + " jam: " + alasan + ")");
                            found = true;
                        } catch (Exception ex) {
                            ex.printStackTrace();
                        }
                    }
                }
                
                if (found) {
                    saveDb(db);
                    JsonObject res = new JsonObject();
                    res.addProperty("success", true);
                    res.addProperty("message", "Waktu peminjaman berhasil ditambahkan");
                    sendJson(resp, res);
                } else {
                    sendError(resp, 404, "Booking not found");
                }
                
            } else if (pathInfo.startsWith("/pcs/") && !pathInfo.endsWith("/status")) {
                String id = pathInfo.split("/")[2];
                JsonObject body = parseBody(req);
                
                JsonArray pcs = db.getAsJsonArray("t_pc");
                for (JsonElement e : pcs) {
                    JsonObject pc = e.getAsJsonObject();
                    if (pc.get("id_pc").getAsString().equals(id)) {
                        if(body.has("status")) pc.addProperty("status", body.get("status").getAsString());
                        if(body.has("spek_cpu")) pc.addProperty("spek_cpu", body.get("spek_cpu").getAsString());
                        if(body.has("spek_ram")) pc.addProperty("spek_ram", body.get("spek_ram").getAsString());
                        if(body.has("spek_ssd")) pc.addProperty("spek_ssd", body.get("spek_ssd").getAsString());
                    }
                }
                saveDb(db);
                JsonObject res = new JsonObject();
                res.addProperty("success", true);
                res.addProperty("message", "PC updated");
                sendJson(resp, res);
                
            } else if (pathInfo.startsWith("/labs/") && pathInfo.endsWith("/switch")) {
                String id = pathInfo.split("/")[2];
                JsonObject body = parseBody(req);
                
                JsonArray labs = db.getAsJsonArray("t_lab");
                for (JsonElement e : labs) {
                    JsonObject lab = e.getAsJsonObject();
                    if (lab.get("id_lab").getAsString().equals(id)) {
                        lab.addProperty("status_jaringan", body.get("status").getAsString());
                    }
                }
                saveDb(db);
                JsonObject res = new JsonObject();
                res.addProperty("success", true);
                res.addProperty("message", "Lab network switched");
                sendJson(resp, res);
                
            } else {
                sendError(resp, 404, "Not found");
            }
        } catch(Exception e) {
            e.printStackTrace();
            sendError(resp, 500, e.getMessage());
        }
    }
}
