
package com.landprofiling.backend.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.landprofiling.backend.entity.Survey;
import com.landprofiling.backend.entity.SurveyImage;
import com.landprofiling.backend.repository.SurveyImageRepository;
import com.landprofiling.backend.repository.SurveyRepository;

@Service
public class ImageStorageService {

    private final SurveyImageRepository imageRepository;
    private final SurveyRepository surveyRepository;
    private final Path storageRoot;

    private static final long MAX_FILE_SIZE = 20 * 1024 * 1024;

    public ImageStorageService(
            SurveyImageRepository imageRepository,
            SurveyRepository surveyRepository,
            @Value("${app.upload.dir:uploads/surveys}") String uploadDir) {

        this.imageRepository = imageRepository;
        this.surveyRepository = surveyRepository;
        this.storageRoot = Paths.get(uploadDir)
                .toAbsolutePath().normalize();
    }

    public List<SurveyImage> uploadImages(
            String surveyId, List<MultipartFile> files) {

        Survey survey = surveyRepository.findById(surveyId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Survey not found"));

        if (files == null || files.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "No images selected");
        }

        List<SurveyImage> uploaded = new ArrayList<>();

        Path surveyDirectory = storageRoot.resolve(surveyId).normalize();

        if (!surveyDirectory.startsWith(storageRoot)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Invalid survey path");
        }

        try {
            Files.createDirectories(surveyDirectory);

            for (MultipartFile file : files) {

                if (file.isEmpty()) {
                    throw new ResponseStatusException(
                            HttpStatus.BAD_REQUEST, "Empty image file");
                }

                if (file.getSize() > MAX_FILE_SIZE) {
                    throw new ResponseStatusException(
                            HttpStatus.PAYLOAD_TOO_LARGE,
                            "Image size must not exceed 20 MB");
                }

                String contentType = file.getContentType();

                if (!List.of("image/jpeg", "image/png")
                        .contains(contentType)) {
                    throw new ResponseStatusException(
                            HttpStatus.BAD_REQUEST,
                            "Only JPG and PNG images are allowed");
                }

                String extension = contentType.equals("image/jpeg")
                        ? ".jpg" : ".png";

                String storedName = UUID.randomUUID() + extension;

                Path destination = surveyDirectory
                        .resolve(storedName).normalize();

                if (!destination.startsWith(surveyDirectory)) {
                    throw new ResponseStatusException(
                            HttpStatus.BAD_REQUEST, "Invalid filename");
                }

                Files.copy(file.getInputStream(), destination,
                        StandardCopyOption.REPLACE_EXISTING);

                SurveyImage image = new SurveyImage();

                image.setSurveyId(surveyId);
                image.setOriginalFilename(
                        Paths.get(file.getOriginalFilename() == null
                                ? "image" : file.getOriginalFilename())
                                .getFileName().toString());
                image.setStoredFilename(storedName);
                image.setFilePath(
                        storageRoot.relativize(destination)
                                .toString().replace("\\", "/"));
                image.setContentType(contentType);
                image.setFileSize(file.getSize());

                uploaded.add(imageRepository.save(image));
            }

            survey.setImageFolder(
                    "uploads/surveys/" + surveyId);
            surveyRepository.save(survey);

            return uploaded;

        } catch (IOException e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Unable to save uploaded images");
        }
    }

    public List<SurveyImage> getImages(String surveyId) {

        if (!surveyRepository.existsById(surveyId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Survey not found");
        }

        return imageRepository
                .findBySurveyIdOrderByUploadedAtDesc(surveyId);
    }

    public Path getImagePath(Long imageId) {

        SurveyImage image = imageRepository.findById(imageId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Image not found"));

        Path path = storageRoot.resolve(image.getFilePath()).normalize();

        if (!path.startsWith(storageRoot) || !Files.isRegularFile(path)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Image file not found");
        }

        return path;
    }

    public String getImageContentType(Long imageId) {

        return imageRepository.findById(imageId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Image not found"))
                .getContentType();
    }
}
