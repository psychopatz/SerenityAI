    package com.SerenityBuilders.SerenityAI.Entity;

    import jakarta.persistence.*;
    import java.util.Date;

    @Entity
    @Table(name = "recommendation") // Your table name in your database
    public class RecommendationEntity {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "recommendation_id") // Your recommendation ID
        private int recommendation_id;

        @Column(name = "recommendation_type")
        private String recommendationType;

        @Column(name = "recommendation_details")
        private String recommendationDetails;

        @Column(name = "date_given")
        private Date dateGiven;

        // Constructors
        public RecommendationEntity() {}

        public RecommendationEntity(int recommendation_id, String recommendationType, String recommendationDetails, Date dateGiven) {
            this.recommendation_id = recommendation_id;
            this.recommendationType = recommendationType;
            this.recommendationDetails = recommendationDetails;
            this.dateGiven = dateGiven;
        }

        public int getRecommendation_id() {
            return recommendation_id;
        }

        public void setRecommendation_id(int recommendation_id) {
            this.recommendation_id = recommendation_id;
        }

        public String getRecommendationType() {
            return recommendationType;
        }

        public void setRecommendationType(String recommendationType) {
            this.recommendationType = recommendationType;
        }

        public String getRecommendationDetails() {
            return recommendationDetails;
        }

        public void setRecommendationDetails(String recommendationDetails) {
            this.recommendationDetails = recommendationDetails;
        }

        public Date getDateGiven() {
            return dateGiven;
        }

        public void setDateGiven(Date dateGiven) {
            this.dateGiven = dateGiven;
        }
    }
