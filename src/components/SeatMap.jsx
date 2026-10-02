import { useState, useMemo } from 'react';
import { getSeatLabel, getSeatType, formatCurrency } from '../utils/helpers.js';
import { getBookedSeats } from '../services/dataService.js';
import './SeatMap.css';

export default function SeatMap({ screen, show, onSelectionChange }) {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const bookedSeats = useMemo(() => getBookedSeats(show._id), [show._id]);

  const handleSeatClick = (seatLabel, seatType) => {
    if (bookedSeats.includes(seatLabel)) return;

    let newSelection;
    if (selectedSeats.find(s => s.label === seatLabel)) {
      newSelection = selectedSeats.filter(s => s.label !== seatLabel);
    } else {
      if (selectedSeats.length >= 10) return; // max 10 seats
      newSelection = [...selectedSeats, { label: seatLabel, type: seatType }];
    }
    setSelectedSeats(newSelection);
    onSelectionChange(newSelection);
  };

  const rows = [];
  for (let r = 0; r < screen.rows; r++) {
    const rowLabel = String.fromCharCode(65 + r);
    const seatType = getSeatType(rowLabel, screen.seatTypes);
    const seats = [];

    for (let s = 0; s < screen.seatsPerRow; s++) {
      const seatLabel = getSeatLabel(r, s);
      const isBooked = bookedSeats.includes(seatLabel);
      const isSelected = selectedSeats.some(sel => sel.label === seatLabel);

      let seatClass = 'seat';
      if (isBooked) seatClass += ' seat--occupied';
      else if (isSelected) seatClass += ' seat--selected';
      else seatClass += ` seat--${seatType}`;

      seats.push(
        <button
          key={seatLabel}
          className={seatClass}
          onClick={() => handleSeatClick(seatLabel, seatType)}
          disabled={isBooked}
          aria-label={`Seat ${seatLabel}${isBooked ? ' (Booked)' : isSelected ? ' (Selected)' : ` (${seatType})`}`}
          title={seatLabel}
        >
          <span className="seat__label">{s + 1}</span>
        </button>
      );
    }

    rows.push(
      <div key={rowLabel} className="seat-row">
        <span className="seat-row__label">{rowLabel}</span>
        <div className="seat-row__seats">{seats}</div>
        <span className="seat-row__label">{rowLabel}</span>
      </div>
    );
  }

  return (
    <div className="seat-map">
      <div className="seat-map__screen">
        <div className="seat-map__screen-bar" />
        <span className="seat-map__screen-label">SCREEN</span>
      </div>

      <div className="seat-map__layout">
        {rows}
      </div>

      <div className="seat-map__legend">
        <div className="legend-item">
          <span className="legend-box legend-box--available" />
          <span>Available</span>
        </div>
        <div className="legend-item">
          <span className="legend-box legend-box--selected" />
          <span>Selected</span>
        </div>
        <div className="legend-item">
          <span className="legend-box legend-box--occupied" />
          <span>Occupied</span>
        </div>
        <div className="legend-item">
          <span className="legend-box legend-box--premium" />
          <span>Premium ({formatCurrency(show.prices.premium[show.format] || 350)})</span>
        </div>
        <div className="legend-item">
          <span className="legend-box legend-box--standard" />
          <span>Standard ({formatCurrency(show.prices.standard[show.format] || 250)})</span>
        </div>
        <div className="legend-item">
          <span className="legend-box legend-box--economy" />
          <span>Economy ({formatCurrency(show.prices.economy[show.format] || 150)})</span>
        </div>
      </div>

      {selectedSeats.length > 0 && (
        <div className="seat-map__summary">
          <span>{selectedSeats.length} seat{selectedSeats.length > 1 ? 's' : ''} selected: {selectedSeats.map(s => s.label).join(', ')}</span>
        </div>
      )}
    </div>
  );
}
