package com.library.book.controller

import jakarta.servlet.http.HttpServletRequest
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class TraceLabController {

    @GetMapping("/trace-lab")
    fun traceLab(request: HttpServletRequest): ResponseEntity<String> {

        val builder = StringBuilder()
        builder.append("TRACE LAB RESPONSE\n")

        val headerNames = request.headerNames

        while (headerNames.hasMoreElements()) {
            val header = headerNames.nextElement()
            builder.append(header)
                .append(": ")
                .append(request.getHeader(header))
                .append("\n")
        }

        return ResponseEntity.ok(builder.toString())
    }
}