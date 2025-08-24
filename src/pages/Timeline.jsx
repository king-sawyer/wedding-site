import "./timeline.css";

const Timeline = () => {
  return (
    <div className="timeline-container">
      <h1>TIMELINE</h1>
      <h3>BELOW IS A TIMELINE FOR THE EVENING</h3>
      <p>(Times provided are rough estimates)</p>
      <ul className="timeline-list">
        <li>
          <span>5:00</span> Ceremony Begins
        </li>
        <li>
          <span>5:30</span> Ceremony Ends
        </li>
        <li>
          <span>5:30</span> Cocktail Hour Begins
        </li>
        <li>
          <span>6:20</span> Dinner Begins
        </li>
        <li>
          <span>7:10</span> Toasts (open mic)
        </li>
        <li>
          <span>7:30</span> Cake Cutting
        </li>
        <li>
          <span>7:45</span> First Dance
        </li>
        <li>
          <span>Until 11:00</span> Partying
        </li>
      </ul>
    </div>
  );
};

export default Timeline;
