import { IoCallOutline } from "react-icons/io5";
import { IoIosPeople } from "react-icons/io";
const lifelines=[
    { icon: <IoIosPeople />, 
    id: 1, 
    info: 'Audience Poll', 
    description: 'The audience will vote on the answer to the question, and the results will be displayed as percentages.' },
    { icon: <IoCallOutline />, 
    id: 2, 
    info: 'Call a Friend', 
    description: 'You can call a friend to help you answer the question.' },
    { text: '50', 
    id: 3, 
    info: '50/50', 
    description: 'Two incorrect answers will be removed, leaving you with two possible answers.' },
]
export default lifelines;