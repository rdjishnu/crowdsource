package com.nexusgov;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nexusgov.dto.StatusUpdateDTO;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class IssueControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testCreateGetAndUpdateIssueFlow() throws Exception {
        MockMultipartFile photo = new MockMultipartFile(
            "photo",
            "test_pothole.jpg",
            MediaType.IMAGE_JPEG_VALUE,
            "fake-image-bytes".getBytes()
        );

        // 1. Report Issue
        String responseJson = mockMvc.perform(multipart("/api/v1/issues")
                .file(photo)
                .param("category", "Pothole")
                .param("description", "Large dangerous pothole near Main Road Ranchi")
                .param("latitude", "23.3441")
                .param("longitude", "85.3096"))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").exists())
            .andExpect(jsonPath("$.category").value("Pothole"))
            .andExpect(jsonPath("$.status").value("Reported"))
            .andReturn().getResponse().getContentAsString();

        // 2. Fetch Stats
        mockMvc.perform(get("/api/v1/issues/stats"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.total").value(1))
            .andExpect(jsonPath("$.reported").value(1));

        // 3. Update Status to In Progress
        StatusUpdateDTO updateDTO = new StatusUpdateDTO("In Progress");
        mockMvc.perform(patch("/api/v1/issues/1/status")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateDTO)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("In Progress"));
    }
}
