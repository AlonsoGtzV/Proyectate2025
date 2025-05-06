package com.ApiSpeech.Service;

import com.ApiSpeech.Model.ChatResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.util.HashMap;
import java.util.Map;

@Service
public class ChatService {

    public ChatResponse processPrompt(String prompt) {
        String apiUrl = "http://localhost:11434/api/generate";

        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> body = new HashMap<>();
        body.put("model", "llama3");  // nombre exacto del modelo en Ollama
        body.put("prompt", prompt);
        body.put("stream", false);    // para que devuelva todo el contenido en una sola respuesta

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(apiUrl, request, Map.class);

        String content = response.getBody().get("response").toString();

        return new ChatResponse(content);
    }
}