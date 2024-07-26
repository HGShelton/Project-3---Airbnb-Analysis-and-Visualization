const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: 'http://127.0.0.1:5501' // Replace with your actual front-end origin
}));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/Boston_Airbnb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Failed to connect to MongoDB:', err);
});

// Define Mongoose schemas and models

// Schema for `listings` collection
const listingSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    name: String,
    host_id: Number,
    host_acceptance_rate: String,
    host_total_listings_count: Number,
    neighbourhood: String,
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    property_type: String,
    room_type: String,
    accommodates: Number,
    bathrooms: Number,
    bedrooms: Number,
    beds: Number,
    price: String,
    minimum_nights: Number,
    maximum_nights: Number,
    review_scores_rating: Number,
    review_scores_accuracy: Number,
    review_scores_cleanliness: Number,
    review_scores_checkin: Number,
    review_scores_communication: Number,
    review_scores_location: Number,
    review_scores_value: Number
});

// Schema for `neighbourhoods` collection
const neighbourhoodSchema = new mongoose.Schema({
    type: { type: String, required: true },
    features: [
        {
            type: { type: String, required: true },
            geometry: {
                type: { type: String, required: true },
                coordinates: { type: [[Number]], required: true }
            },
            properties: { type: Object, required: true }
        }
    ]
});

// Define models
const Listing = mongoose.model('Listing', listingSchema);
const Neighbourhood = mongoose.model('Neighbourhood', neighbourhoodSchema);

// Route to get listings
app.get('/api/listings', async (req, res) => {
    try {
        const listings = await Listing.find();
        res.json(listings);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch listings', error: error.message });
    }
});

// Route to get neighbourhoods
app.get('/api/neighbourhoods', async (req, res) => {
    try {
        const neighbourhoods = await Neighbourhood.find();
        res.json(neighbourhoods.length > 0 ? neighbourhoods : { message: 'No neighbourhoods found' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch neighbourhoods', error: error.message });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
