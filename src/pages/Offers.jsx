import './Offers.css';

const offers = [
  {
    id: 1,
    title: 'First Booking Discount',
    description: 'New to CineBook? Get 20% off on your first movie ticket. Create an account and use the code at checkout.',
    code: 'FIRST20',
    validTill: 'Oct 31, 2026',
    tag: 'New Users'
  },
  {
    id: 2,
    title: 'Weekend Movie Mania',
    description: 'Enjoy a flat ₹50 discount on Standard seats for any movie booked on Saturday or Sunday. No minimum order required.',
    code: 'WEEKEND50',
    validTill: 'Every Weekend',
    tag: 'All Users'
  },
  {
    id: 3,
    title: 'Premium Seat Upgrade',
    description: 'Experience Premium seating at Standard prices on all weekday shows before 4 PM. Subject to seat availability.',
    code: 'UPGRADE',
    validTill: 'Nov 15, 2026',
    tag: 'Limited Period'
  },
  {
    id: 4,
    title: 'Student Pass',
    description: '15% off on all bookings with a valid student ID. Show your college ID at the cinema entrance for verification.',
    code: 'STUDENT15',
    validTill: 'Dec 31, 2026',
    tag: 'Students'
  },
  {
    id: 5,
    title: 'IMAX for Less',
    description: 'Book any IMAX show on Tuesdays and get ₹100 off per ticket. The ultimate big screen experience at a smaller price.',
    code: 'IMAXTUE',
    validTill: 'Every Tuesday',
    tag: 'IMAX'
  },
  {
    id: 6,
    title: 'Refer & Earn',
    description: 'Invite a friend to CineBook. When they complete their first booking, both of you get ₹75 off on your next ticket.',
    code: 'REFERWIN',
    validTill: 'Nov 30, 2026',
    tag: 'Referral'
  }
];

export default function Offers() {
  return (
    <div className="page">
      <div className="container container--narrow">
        <div className="page__header">
          <h1 className="page__title">Offers & Deals</h1>
          <p className="page__subtitle">Save more on every booking</p>
        </div>

        <div className="offers-list">
          {offers.map(offer => (
            <div key={offer.id} className="offer-card">
              <div className="offer-card__header">
                <span className="badge badge--accent">{offer.tag}</span>
                <span className="offer-card__validity">Valid till {offer.validTill}</span>
              </div>
              <h3 className="offer-card__title">{offer.title}</h3>
              <p className="offer-card__description">{offer.description}</p>
              <div className="offer-card__code">
                <span className="offer-card__code-label">Use code:</span>
                <span className="offer-card__code-value">{offer.code}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="offers-note">
          <p>Offers cannot be combined with other promotions. Terms & conditions apply.</p>
        </div>
      </div>
    </div>
  );
}
