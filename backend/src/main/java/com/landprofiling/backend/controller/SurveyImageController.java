
package com.landprofiling.backend.controller;

import java.nio.file.Path;
import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.landprofiling.backend.entity.SurveyImage;
import com.landprofiling.backend.service.ImageStorageService;

@RestController
@RequestMapping("/api/surveys")
public class SurveyImageController {

    private final ImageStorageService imageService;

    public SurveyImageController(ImageStorageService imageService) {
        this.imageService = imageService;
    }

    // Upload multiple images for a survey
    @PostMapping(
        value = "/{surveyId}/images",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<List<SurveyImage>> uploadImages(
            @PathVariable String surveyId,
            @RequestParam("files") List<MultipartFile> files) {

        List<SurveyImage> uploaded =
                imageService.uploadImages(surveyId, files);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(uploaded);
    }

    // Get all images belonging to a survey
    @GetMapping("/{surveyId}/images")
    public List<SurveyImage> getImages(
            @PathVariable String surveyId) {

        return imageService.getImages(surveyId);
    }

    // View an uploaded image
    @GetMapping("/images/{imageId}/file")
    public ResponseEntity<Resource> viewImage(
            @PathVariable Long imageId) throws Exception {

        Path path = imageService.getImagePath(imageId);

        Resource resource = new UrlResource(path.toUri());

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(
                        imageService.getImageContentType(imageId)))
                .body(resource);
    }
}
