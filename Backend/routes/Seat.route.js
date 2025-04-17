const express = require("express");
const { SeatModel } = require("../model/Seat.model");


const Seat_Route = express.Router();




//get all post from SeatModel
Seat_Route.get("/", async (req, res) => {
    try {
        const notes = await SeatModel.find();
        res.send(notes.reverse());
    } catch (error) {
        console.log(error)
    }

});

//create a post



//   Seat_Route.post("/", async (req, res) => {
//     const newPost = new SeatModel(req.body);
//     try {
//       const savedPost = await newPost.save();
//       res.status(200).json(savedPost)
//     } catch (err) {
//       res.status(500).json(err);
//     }
//   });


//   // get post by id

//   Seat_Route.get("/:id", async (req, res) => {
//   try {
//     const post = await SeatModel.findById(req.params.id);

//     res.status(200).json(post);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });


// Seat_Route.get("/search/:q", async (req, res) => {
//   const data = req.params.q;

//   try {
//     const user = await SeatModel.find(  { model_name: { $regex: data || "", $options: 'i' } },);

//     res.status(200).json(user);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });












Seat_Route.get('/', async (req, res) => {
    try {
        const seats = await SeatModel.find();
        res.json(seats.reverse());
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve seats' });
    }
});





Seat_Route.post('/book', async (req, res) => {
    const { bookseat } = req.body;
  
    let response = "";
  
    try {
      if (bookseat.length !== 0) {
        for (let i = 0; i < bookseat.length; i++) {
          const seats = await SeatModel.find({ id: bookseat[i] });
          for (let j = 0; j < seats.length; j++) {
            response += seats[j].seatNumber + " ";
          }
        }
      }
  
      const update = { $set: { status: "booked" } };
  
      if (bookseat.length !== 0) {
        for (let i = 0; i < bookseat.length; i++) {
          await SeatModel.updateMany({ id: bookseat[i] }, update);
        }
      }
  
      res.status(200).json(`You have booked seats: ${response}`);
    } catch (error) {
      res.status(500).json({ error: 'Seat booking failed.' });
    }
  });
  

Seat_Route.post("/add", async (req, res) => {
    const newSeat = new SeatModel(req.body);
    try {
        const savedPost = await newSeat.save();
        res.status(200).json(savedPost)
    } catch (err) {
        res.status(500).json(err);
    }
});


Seat_Route.delete("/:id", async (req, res) => {
    // if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
        await SeatModel.findByIdAndDelete(req.params.id);
        res.status(200).json("Post has been deleted");
    } catch (err) {
        return res.status(500).json(err);
    }

});


Seat_Route.put("/cancel", async (req, res) => {

    const {seatid} = req.body;

    const update = { $set: { status: "available"} };

 
    try {
        const user = await SeatModel.findByIdAndUpdate(seatid, update);
        res.status(200).json("Booking Successfully cancel");
    } catch (err) {
        return res.status(500).json(err);
    }

});

// reset  
Seat_Route.get("/reset", async (req, res) => {

   

 
    try {
        const user = await SeatModel.updateMany({},{ $set: { status: "available" } })
        res.status(200).json("All bookings reset successfully ");
    } catch (err) {
        return res.status(500).json(err);
    }

});


Seat_Route.put("/id/:id", async (req, res) => {

    const {seatid,seatNumber} = req.body;
const id = req.params.id
console.log(seatid,id)
    const update = { $set: { id: seatid, seatNumber:seatNumber} };

 
    try {
        const user = await SeatModel.findByIdAndUpdate(id, update);
        res.status(200).json(user);
    } catch (err) {
        return res.status(500).json(err);
    }

});




module.exports = {
    Seat_Route
};