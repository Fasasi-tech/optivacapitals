import { MdOutlinePending, MdOutlineQueryBuilder  } from "react-icons/md";
import { CgProfile } from "react-icons/cg";

export const Menus=[
    {
        "id":1,
        "title":"Request for leave",
        "icon": <MdOutlinePending />,
        "path":"/Leave-Management"

    },
    {
        "id":2,
        "title":"Complaint form",
        "icon": <MdOutlineQueryBuilder />,
        "path":"/Complaint"

    },
    {
        "id":3,
        "title":"Leave History",
        "icon": <MdOutlinePending />,
        "path":"/History"

    },
    {
        "id":4,
        "title":"Profile",
        "icon": <CgProfile />,
        "path":"/Profile"

    }
]