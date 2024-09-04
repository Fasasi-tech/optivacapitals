import { MdOutlinePending, MdOutlineQueryBuilder  } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { FaPaypal } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import { IoCalendarClearOutline } from "react-icons/io5";

export const Menus=[
    {
        "id":1,
        "title":"Profile",
        "icon": <CgProfile />,
        "path":"/Profile"

    },
    {
        "id":2,
        "title":"Request for leave",
        "icon": <MdOutlinePending />,
        "path":"/Leave-Management"

    },
    {
        "id":3,
        "title":"Leave History",
        "icon": <MdOutlinePending />,
        "path":"/History"

    },
    {
        "id":4,
        "title":" Acknowledgement",
        "icon": <FaCheckCircle />,
        "path":"/acknowledgement"

    },
    {
        "id":5,
        "title":" Acknowledgement History",
        "icon": <IoCalendarClearOutline />,
        "path":"/acknowledgement-history"

    },
    {
        "id":6,
        "title":"Complaint form",
        "icon": <MdOutlineQueryBuilder />,
        "path":"/Complaint"

    },
    
    {
        "id":7,
        "title":"Complaint History",
        "icon": <CgProfile />,
        "path":"/Complaint-History"

    },
    
  
     
    {
        "id":8,
        "title":"Pay Slip",
        "icon": <FaPaypal />,
        "path":"/pay-slip"

    },

    
]