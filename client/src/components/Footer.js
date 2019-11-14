// Notes Below:
// Team! this is component uses Materialize <- Thanks for letting me know! :D Troy

//Import Dependencies
import React from "react";

function Footer() {
  return (
    <footer className="page-footer">
      <div className="footer-copyright">
        <div className="container">
          © 2019 Copyright
       <h8 className="white-text right">The MED 2.0 Team (click on the name to visit their GitHub)</h8>
          <ul>
            <li><a className="grey-text text-lighten-3 right" href="https://github.com/arif2301">- Arifur Rahman </a></li>
            <li><a className="grey-text text-lighten-3 right" href="https://github.com/lcocard">- Lawrence Cocard </a></li>
            <li><a className="grey-text text-lighten-3 right" href="https://github.com/majedline">- Majed Atwi </a></li>
            <li><a className="grey-text text-lighten-3 right " href="https://github.com/Garciat427">Troy Garcia </a></li>
          </ul>
          {/* <a className="grey-text text-lighten-4 right" href="#!">More Links</a> */}
        </div>
      </div>
    </footer>
  );
}


export default Footer;
