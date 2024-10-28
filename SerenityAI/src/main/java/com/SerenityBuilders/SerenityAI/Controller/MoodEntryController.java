    package com.SerenityBuilders.SerenityAI.Controller;


    import com.SerenityBuilders.SerenityAI.Entity.MoodEntryEntity;
    import com.SerenityBuilders.SerenityAI.Service.MoodEntryService;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.http.HttpStatus;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.*;

    import javax.naming.NameNotFoundException;
    import java.util.List;

    @RestController
    @CrossOrigin(origins = "http://localhost:5173")
    @RequestMapping("/moodEntry")
    public class MoodEntryController {

        @Autowired
        private MoodEntryService moodEntryService;

        @PostMapping(value = "/post")
        public ResponseEntity<MoodEntryEntity> postMoodEntryRecord(@RequestBody MoodEntryEntity moodEntry){
            MoodEntryEntity savedMoodEntry =moodEntryService.postMoodEntryRecord(moodEntry);
            return new ResponseEntity<>(savedMoodEntry, HttpStatus.CREATED);
        }

        @GetMapping(value = "/get")
        public ResponseEntity<List<MoodEntryEntity>> getAllMoodEntry(){
            List<MoodEntryEntity> moodEntry = moodEntryService.getAllMoodEntry();
            return new ResponseEntity<>(moodEntry, HttpStatus.OK);
        }

        @PutMapping("/update/{id}")
        public MoodEntryEntity putMoodEntryDetails(@PathVariable("id") int id, @RequestBody MoodEntryEntity newMoodEntryDetails) throws NameNotFoundException{
            return moodEntryService.putMoodEntryDetails(id, newMoodEntryDetails);
        }

        @DeleteMapping("/delete/{id}")
        public String deleteMoodEntry(@PathVariable("id") int id){
            return moodEntryService.deleteMoodEntry(id);
        }



    }
