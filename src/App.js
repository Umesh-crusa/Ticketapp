import './App.css';
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast
} from "@chakra-ui/react";

function App() {
  const [getseat, setgetseat] = useState([]);
  const [status, setstatus] = useState([]);
  const [seatcounts, setseatcounts] = useState(1);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const finalRef = React.useRef(null);

  const get_data_handle = async () => {
    try {
      let res = await axios.get("https://unstop-server-git-main-vishaltandale987.vercel.app/seat");
      setgetseat(res.data);
      setstatus(res.data.map(seat => seat.status));
    } catch (error) {
      console.log(error);
    }
  };

  const bookSeats = (seatcount) => {
    seatcount = parseInt(seatcount);
    if (seatcount > 7) return [];

    const tempArray = [];
    for (let i = 0; i <= 80 - seatcount; i++) {
      let seatsPerRow = i < 77 ? 7 : 3;
      if (
        (i % seatsPerRow) + seatcount <= seatsPerRow &&
        status.slice(i, i + seatcount).every(seat => seat === "available")
      ) {
        for (let j = 0; j < seatcount; j++) {
          const seatIndex = i + j;
          tempArray.push(seatIndex);
        }
        break;
      }
    }
    return tempArray;
  };

  const update_seat_handle = async (seatsToBook) => {
    if (seatsToBook.length === 0) return;

    try {
      let res = await axios.post("https://unstop-server-git-main-vishaltandale987.vercel.app/seat/book", {
        bookseat: seatsToBook
      });
      toast({
        title: res.data,
        status: 'success',
        duration: 4000,
        isClosable: true,
        position: 'top-left',
      });
      setBookedSeats(seatsToBook);
      setSelectedSeats([]);
      get_data_handle();
    } catch (error) {
      console.log(error);
    }
  };

  const handleBookSeat = () => {
    const selectedCount = selectedSeats.length;
    const enteredCount = parseInt(seatcounts);

    if (selectedCount > 7 || enteredCount > 7) {
      toast({
        title: 'You can only book up to 7 seats at a time.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
      return;
    }

    if (selectedCount > 0) {
      update_seat_handle(selectedSeats);
    } else {
      const autoSelected = bookSeats(enteredCount);
      update_seat_handle(autoSelected);
    }
  };

  const handleSeatClick = (seat, index) => {
    if (seat.status === "booked") {
      localStorage.setItem("seatid", seat._id);
      onOpen();
    } else {
      setSelectedSeats(prev => {
        if (prev.includes(index)) {
          return prev.filter(i => i !== index);
        } else if (prev.length < 7) {
          return [...prev, index];
        } else {
          toast({
            title: 'Max 7 seats can be selected.',
            status: 'warning',
            duration: 2000,
            isClosable: true,
            position: 'top-right',
          });
          return prev;
        }
      });
    }
  };

  const handleCancelbooking = async () => {
    let seat_id = localStorage.getItem("seatid");
    try {
      await axios.put("https://unstop-server-git-main-vishaltandale987.vercel.app/seat/cancel", {
        seatid: seat_id
      });
      onClose();
      localStorage.removeItem("seatid");
      toast({
        title: 'Booking Successfully cancelled',
        status: 'warning',
        duration: 2000,
        isClosable: true,
        position: 'top-right',
      });
      get_data_handle();
    } catch (error) {
      console.log(error);
    }
  };

  const handlereset = async () => {
    try {
      let res = await axios.get("https://unstop-server-git-main-vishaltandale987.vercel.app/seat/reset");
      toast({
        title: res.data,
        status: 'success',
        duration: 2000,
        isClosable: true,
        position: 'top',
      });
      get_data_handle();
      setBookedSeats([]);
    } catch (error) {
      console.log(error);
    }
  };

  const availableSeatsCount = status.filter(seat => seat === "available").length;
  const totalBookedSeats = status.filter(seat => seat === "booked").length;

  useEffect(() => {
    get_data_handle();
  }, []);

  return (
    <div className='main-box'>
      <div className='second'>
        <h1 className='text'>Ticket Booking</h1>

        <div id="coach" className="coach">
          {getseat.map((seat, index) => (
            <div
              key={index}
              className={`seat ${seat.status} ${selectedSeats.includes(index) ? "selected" : ""}`}
              onClick={() => handleSeatClick(seat, index)}
            >
              <p className="name">{seat.seatNumber}</p>
            </div>
          ))}
        </div>

        <div className='flex'>
          <p className="seatstext1">Available Seats = {availableSeatsCount}</p>
          <p className="seatstext">Booked Seats = {totalBookedSeats} </p>
        </div>
      </div>

      <div className='first'>
        <div className="input">
          <div className='show'>
            <h3><b>Seat Booking</b></h3>
            <div
              className='show-seat'
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                paddingTop: "10px"
              }}
            >
              {bookedSeats.length > 0 ? (
                bookedSeats.map(index => (
                  <div
                    key={index}
                    className="seat booked"
                    style={{
                      width: "4vw",
                      height: "5vh",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "8px",
                      backgroundColor: "yellow",
                      fontWeight: "500"
                    }}
                  >
                    {getseat[index]?.seatNumber}
                  </div>
                ))
              ) : (
                <span style={{ color: "#888" }}>No seats</span>
              )}
            </div>
          </div>

          <div className='inp' style={{
            display: "flex",
            gap:"12px",
            alignItems: "center",
            margin: "auto",
            width: "100%",
            flexWrap: "wrap"
          }}>

            <div className='fil'>
              <Input
                placeholder="Enter number of seats"
                onChange={(e) => setseatcounts(e.target.value)}
                w={290}
                border="1px"
                borderColor="gray.800"
                type="number"
                min={1}
                max={7}
              />
            </div>
            <div className='bok'>
              <Button
                onClick={handleBookSeat}
                size="md"
                colorScheme="facebook"
                mt={5}
                mb={5}
              >
                Book Ticket
              </Button>
            </div>
          </div>
          <Button className='res'
            onClick={handlereset}
            colorScheme="facebook"
          >
            Reset Booking
          </Button>
        </div>
      </div>

      <Modal finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>You want to cancel booking?</ModalHeader>
          <ModalBody />
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              No
            </Button>
            <Button colorScheme='orange' onClick={handleCancelbooking}>
              Yes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default App;
