package com.nexusgov.storage;

import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Path;

public interface FileStorageService {
    void init();
    String storeFile(MultipartFile file);
    Path load(String filename);
}
