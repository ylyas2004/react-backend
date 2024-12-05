var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Venue = mongoose.model('venue');
var Comment = mongoose.model('comment');
var Hour = mongoose.model('hour');

// Route to get all venues
router.get('/venues', async (req, res) => {
    try {
        const venues = await Venue.find({});  // Fetch all venues
        res.status(200).json(venues);         // Return venues as JSON
    } catch (err) {
        console.error("Error fetching venues:", err.message);
        res.status(500).json({ error: 'Unable to fetch venues' });
    }
});

// Get a venue by ID
router.get('/venues/:id', async (req, res) => {
    try {
        const venue = await Venue.findById(req.params.id);
        if (!venue) {
            return res.status(404).json({ message: 'Venue not found' });
        }
        res.status(200).json(venue);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a new venue
router.post('/venues', async (req, res) => {
    try {
        const newVenue = new Venue(req.body);
        const savedVenue = await newVenue.save();
        res.status(201).json(savedVenue);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update a venue
router.put('/venues/:id', async (req, res) => {
    try {
        const updatedVenue = await Venue.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedVenue) {
            return res.status(404).json({ message: 'Venue not found' });
        }
        res.status(200).json(updatedVenue);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete a venue
router.delete('/venues/:id', async (req, res) => {
    try {
        const deletedVenue = await Venue.findByIdAndDelete(req.params.id);
        if (!deletedVenue) {
            return res.status(404).json({ message: 'Venue not found' });
        }
        res.status(200).json({ message: 'Venue deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a comment to a venue
router.post('/venues/:id/comments', async (req, res) => {
    try {
        const venueId = req.params.id;
        const { author, rating, text, venueDetails } = req.body;  // Assuming `venueDetails` contains data for venue update

        // First, find the venue by ID
        const venue = await Venue.findById(venueId);
        if (!venue) {
            return res.status(404).json({ message: 'Venue not found' });
        }

        // Update venue if venueDetails are provided
        if (venueDetails) {
            // Update the venue with the provided details
            await Venue.findByIdAndUpdate(venueId, venueDetails, { new: true });
        }

        // Now, create the new comment
        const newComment = new Comment({
            author: author,
            rating: rating,
            text: text,
        });

        // Add the new comment to the venue's comments array
        venue.comments.push(newComment);

        // Save the updated venue with the new comment
        await venue.save();

        // Send a response with the added comment
        res.status(201).json(newComment);
    } catch (err) {
        console.error("Error posting comment and updating venue:", err.message);
        res.status(400).json({ error: err.message });
    }
});


// Get all comments for a venue
router.get('/venues/:id/comments', async (req, res) => {
    try {
        const venue = await Venue.findById(req.params.id).populate('comments');  // Populate the comments
        if (!venue) {
            return res.status(404).json({ message: 'Venue not found' });
        }
        res.status(200).json(venue.comments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add an hour to a venue
router.post('/venues/:id/hours', async (req, res) => {
    try {
        const venue = await Venue.findById(req.params.id);
        if (!venue) {
            return res.status(404).json({ message: 'Venue not found' });
        }
        const newHour = new Hour(req.body);
        venue.hours.push(newHour);  // Add the new hour to the venue's hours array
        await venue.save();
        res.status(201).json(newHour);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all hours for a venue
router.get('/venues/:id/hours', async (req, res) => {
    try {
        const venue = await Venue.findById(req.params.id);
        if (!venue) {
            return res.status(404).json({ message: 'Venue not found' });
        }
        res.status(200).json(venue.hours);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update an hour for a venue
router.put('/venues/:id/hours/:hourId', async (req, res) => {
    try {
        const venue = await Venue.findById(req.params.id);
        if (!venue) {
            return res.status(404).json({ message: 'Venue not found' });
        }
        const hour = venue.hours.id(req.params.hourId);
        if (!hour) {
            return res.status(404).json({ message: 'Hour not found' });
        }
        hour.set(req.body);  // Update the hour fields with new data
        await venue.save();
        res.status(200).json(hour);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete an hour for a venue
router.delete('/venues/:id/hours/:hourId', async (req, res) => {
    try {
        const venue = await Venue.findById(req.params.id);
        if (!venue) {
            return res.status(404).json({ message: 'Venue not found' });
        }
        const hour = venue.hours.id(req.params.hourId);
        if (!hour) {
            return res.status(404).json({ message: 'Hour not found' });
        }
        hour.remove();  // Remove the hour from the venue
        await venue.save();
        res.status(200).json({ message: 'Hour deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a comment from a venue
router.delete('/venues/:id/comments/:commentId', async (req, res) => {
    try {
        const venue = await Venue.findById(req.params.id);
        if (!venue) {
            return res.status(404).json({ message: 'Venue not found' });
        }
        const comment = venue.comments.id(req.params.commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        comment.remove();  // Remove the comment from the venue
        await venue.save();
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
