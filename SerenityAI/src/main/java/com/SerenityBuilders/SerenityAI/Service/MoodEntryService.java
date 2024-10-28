package com.SerenityBuilders.SerenityAI.service;


import com.SerenityBuilders.SerenityAI.entity.MoodEntryEntity;
import com.SerenityBuilders.SerenityAI.repository.MoodEntryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.naming.NameNotFoundException;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class MoodEntryService {

    @Autowired
    private MoodEntryRepository merepo;

    //Create
    public MoodEntryEntity postMoodEntryRecord(MoodEntryEntity moodEntry){
            return merepo.save(moodEntry);
    }

    //Read
    public List<MoodEntryEntity> getAllMoodEntry(){
        return merepo.findAll();
    }

    //Update
    @SuppressWarnings("finally")
    public MoodEntryEntity putMoodEntryDetails(int id, MoodEntryEntity newMoodEntryDetails) throws NameNotFoundException{
        MoodEntryEntity moodEntry = new MoodEntryEntity();
        try {
            moodEntry = merepo.findById(id).get();

            moodEntry.setMood_type(newMoodEntryDetails.getMood_type());
            moodEntry.setDescription(newMoodEntryDetails.getDescription());
            moodEntry.setEntry_date(newMoodEntryDetails.getEntry_date());

        }catch (NoSuchElementException nex){
            throw new NameNotFoundException("moodEntry"+ id + "mot found");
        }finally {
            return merepo.save(moodEntry);
        }
    }

    //Delete
    public String deleteMoodEntry(int id) {
        /*if (merepo.existsById(id)) {
            merepo.deleteById(id);
            return "MoodEntry Record successfully deleted!";
        } else
            return "MoodEntry with the ID" + id + "NOT FOUND!";*/
            merepo.deleteById(id);
            return "MoodEntry Record successfully deleted!";

    }

}
