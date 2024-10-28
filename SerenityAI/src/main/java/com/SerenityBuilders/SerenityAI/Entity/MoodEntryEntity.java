package com.SerenityBuilders.SerenityAI.Entity;


import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "mood_entry") //My Table name in my database
public class MoodEntryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "mood_entry_id")//
    private int mood_entry_id;

    @Column(name = "mood_type")
    private String mood_type;

    @Column(name = "description")
    private String description;

    @Column(name = "entry_date")
    private Date entry_date;

    //Constructors
    public MoodEntryEntity(){
    }

    public MoodEntryEntity(int mood_entry_id, String mood_type, String description, Date entry_date){
        this.mood_entry_id = mood_entry_id;
        this.mood_type = mood_type;
        this.description = description;
        this.entry_date = entry_date;
    }

    public int getMood_entry_id(){
        return mood_entry_id;
    }

    public void setMood_entry_id(int mood_entry_id){
        this.mood_entry_id = mood_entry_id;
    }

    public String getMood_type(){
        return mood_type;
    }

    public void setMood_type(String mood_type){
        this.mood_type = mood_type;
    }

    public String getDescription(){
        return description;
    }

    public void setDescription(String description){
        this.description = description;
    }

    public Date getEntry_date(){
        return entry_date;
    }

    public void setEntry_date(Date entry_date){
        this.entry_date = entry_date;
    }


}
