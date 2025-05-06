package com.ApiSpeech.Controller;


import com.ApiSpeech.Model.ChatRequest;
import com.ApiSpeech.Model.ChatResponse;
import com.ApiSpeech.Service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @PostMapping
    public ChatResponse handlePrompt(@RequestBody ChatRequest request) {
        return chatService.processPrompt(request.getPrompt());
    }
}