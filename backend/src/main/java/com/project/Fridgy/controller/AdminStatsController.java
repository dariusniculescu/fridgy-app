package com.project.Fridgy.controller;

import com.project.Fridgy.dto.DashboardStatsDTO;
import com.project.Fridgy.service.AdminStatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminStatsController {

    @Autowired
    private final AdminStatsService statsService;

    public AdminStatsController(AdminStatsService statsService) {
        this.statsService = statsService;
    }

    @GetMapping("/stats")
    public DashboardStatsDTO getStats() {
        return statsService.getStats();
    }
}
