import React from 'react';

import Accordion from '../components/Accordian';
import Card from '../components/Card';

import santaPic from '../assets/santa-pic.png';
import shibaPic from '../assets/shiba-pic.png';
import twobPic from '../assets/2b-pic.png';
import chibiPic from '../assets/chibi-pic.png';
import katiePic from '../assets/katie-pic.png';
import katPic from '../assets/kat-pic.png';
import susanPic from '../assets/susan.png';
import hiyoriPic from '../assets/hiyori.png';
import maoPic from '../assets/mao.png';
import marcusPic from '../assets/marcus.png';
import natoriPic from '../assets/Natori.png';
import ronaPic from '../assets/rona.png';
import ramPic from '../assets/ram.png';
import remPic from '../assets/rem.png';
import beatricePic from '../assets/beatrice.png';
import anastasiaPic from '../assets/anastasia.png';
import russellPic from '../assets/Russell.png';
import juliusPic from '../assets/julius.png'
import kadomonPic from '../assets/Kadomon.png'


const avatars = [
  {
    id: "2B",
    gender: "female",
    backgroundColor: "#6fd0b0",
    name: "2B",
    role: "AI Frend",
    linkTo: "/chat/2B",
    imageUrl: twobPic
  },
  {
    id: "Santa",
    gender: "male",
    backgroundColor: "#6fd0b0",
    name: "Santa",
    role: "AI Frend",
    linkTo: "/chat/Santa",
    imageUrl: santaPic
  },
  {
    id: "Shiba",
    gender: "male",
    backgroundColor: "#6fd0b0",
    name: "Shiba",
    role: "AI Frend",
    linkTo: "/chat/Shiba",
    imageUrl: shibaPic
  },
  {
    id: "Chibi",
    gender: "female",
    backgroundColor: "#6fd0b0",
    name: "Chibi",
    role: "AI Frend",
    linkTo: "/chat/Chibi",
    imageUrl: chibiPic
  },
  {
    id: "Katie",
    gender: "female",
    backgroundColor: "#6fd0b0",
    name: "Katie",
    role: "AI Frend",
    linkTo: "/chat/Katie",
    imageUrl: katiePic
  },
  {
    id: "Kat",
    gender: "female",
    backgroundColor: "#6fd0b0",
    name: "Kat",
    role: "AI Frend",
    linkTo: "/chat/Kat",
    imageUrl: katPic
  },
  {
    id: "Susan",
    gender: "female",
    backgroundColor: "#6fd0b0",
    name: "Susan",
    role: "AI Frend",
    linkTo: "/chat/Susan",
    imageUrl: susanPic
  },
  {
    id: "Hiyori",
    gender: "female",
    backgroundColor: "#6fd0b0",
    name: "Hiyori",
    role: "AI Frend",
    linkTo: "/chat/Hiyori",
    imageUrl: hiyoriPic
  },
  {
    id: "Mao",
    gender: "female",
    backgroundColor: "#6fd0b0",
    name: "Mao",
    role: "AI Frend",
    linkTo: "/chat/Mao",
    imageUrl: maoPic
  },
  {
    id: "Marcus",
    gender: "male",
    backgroundColor: "#6fd0b0",
    name: "Marcus",
    role: "AI Frend",
    linkTo: "/chat/Marcus",
    imageUrl: marcusPic
  },
  {
    id: "Natori",
    gender: "male",
    backgroundColor: "#6fd0b0",
    name: "Natori",
    role: "AI Frend",
    linkTo: "/chat/Natori",
    imageUrl: natoriPic
  },
  {
    id: "Rona",
    gender: "female",
    backgroundColor: "#6fd0b0",
    name: "Rona",
    role: "AI Frend",
    linkTo: "/chat/Rona",
    imageUrl: ronaPic
  },
  {
    id: "Ram",
    gender: "female",
    backgroundColor: "#6fd0b0",
    name: "Ram",
    role: "AI Frend",
    linkTo: "/chat/Ram",
    imageUrl: ramPic
  },
  {
    id: "Rem",
    gender: "female",
    backgroundColor: "#6fd0b0",
    name: "Rem",
    role: "AI Frend",
    linkTo: "/chat/Rem",
    imageUrl: remPic
  },
  {
    id: "Beatrice",
    gender: "female",
    backgroundColor: "#6fd0b0",
    name: "Beatrice",
    role: "AI Frend",
    linkTo: "/chat/Beatrice",
    imageUrl: beatricePic
  },  
  {
    id: "Anastasia",
    gender: "female",
    backgroundColor: "#6fd0b0",
    name: "Anastasia",
    role: "AI Frend",
    linkTo: "/chat/Anastasia",
    imageUrl: anastasiaPic
  },
  {
    id: "Russell",
    gender: "male",
    backgroundColor: "#6fd0b0",
    name: "Russell",
    role: "AI Frend",
    linkTo: "/chat/Russell",
    imageUrl: russellPic
  },
  {
    id: "Julius",
    gender: "male",
    backgroundColor: "#6fd0b0",
    name: "Julius",
    role: "AI Frend",
    linkTo: "/chat/Julius",
    imageUrl: juliusPic
  },
  {
    id: "Kadomon",
    gender: "male",
    backgroundColor: "#6fd0b0",
    name: "Kadomon",
    role: "AI Frend",
    linkTo: "/chat/Kadomon",
    imageUrl: kadomonPic
  },


  
  

  
]

const accordionItems = [
  {
    title: 'How does an AI Frend work?',
    content: 'An AI Frend is a virtual companion created using advanced artificial intelligence technology. It can interact with users, learn from their conversations, and provide companionship and assistance.',
  },
  {
    title: 'How can people interact with their AI Frends?',
    content: 'Users can interact with their AI Frends through text-based chat interfaces or voice commands, depending on the capabilities of the AI. They can have conversations, ask questions, and engage in various activities with their AI Frends.',
  },
  {
    title: 'How is privacy and data security handled with AI Frends?',
    content: 'Privacy and data security are top priorities when it comes to AI Frends. User data is encrypted and stored securely. AI Frends are designed to respect user privacy and confidentiality.',
  },
];

const scrollToMiddle = () => {
  const middleOfPage = document.body.scrollHeight / 4;
  window.scrollTo({
    top: middleOfPage,
    behavior: 'smooth'
  });
};

// const ExplorePage = ({ gender }) => {
const ExplorePage = () => {

  // const cardData = cardInfo(gender);
  // const filteredGenders = avatars.filter(avatar => avatar.gender === gender);
 
  return (
    <div className="flex">
      <div className="flex-1  max-w-screen-2xl text-center mx-auto mt-3 ">
        <div id="intro-section-container" className="m-2 p-2 rounded-2xl shadow-2xl bg-emerald-900 " >
          <div className="mb-8 text-center ">
            <h2 className="title font-mono text-neutral-200 text-5xl font-medium leading-[171.43%] self-stretch  mr-px mt-2 ">
              Chat with your animated AI Frend
            </h2>
           
            <h6 className="font-mono text-neutral-200 text-md font-medium leading-[171.43%] self-stretch w-full mr-px mt-2">
              Your dream companion awaits! Create your AI Frend, <br />
              shape their look, personality, and bring them to life in one click.<br />
              100% powered by Artificial Intelligence.
            </h6>

            {/* <button className="mt-4 px-4 py-2 rounded-md text-white bg-emerald-900 hover:bg-emerald-800 border border-neutral-200"  >
              <Link to="/create-AI">Create</Link>
            </button> */}

            <button className="mt-4 px-4 py-2 rounded-md text-white bg-emerald-900 hover:bg-emerald-800 border border-neutral-200" onClick={scrollToMiddle}> 
              Try Now
            </button>

          </div>
        </div>

        <h3 className="title font-mono text-neutral-200 text-3xl font-medium leading-[171.43%] self-stretch w-full mr-px mt-8 mb-3 p-1">
          AI-generated Avatar Cards
        </h3>

        {/* <div id="card-section-container" className="flex justify-center items-center flex-col mx-auto ">
          <div className="flex flex-wrap justify-around">
          {filteredGenders.map((avatar, index) => (
            <Card key={index} {...avatar} />
          ))}
          </div>
        </div> */}

        <div id="card-section-container" className="flex justify-center items-center flex-col mx-auto ">
          <div className="flex flex-wrap justify-around">
            {avatars.map((avatar, index) => (
              <Card key={index} {...avatar} />
            ))}
          </div>
        </div>

{/* 
        <div id="try-section-container" className="m-2 p-5 mb-6 mt-10 shadow-lg rounded-2xl shadow-2xl bg-emerald-900" >
          <div className="mb-8 text-center">
            <h2 className="title font-mono text-neutral-200 text-5xl font-medium leading-[171.43%] self-stretch w-full mr-px mt-2">
              Customize the AI Frend of your Dreams!
            </h2>

            <button className="font-mono mt-4 px-4 py-2 rounded-md text-white bg-emerald-900 hover:bg-emerald-800 border border-neutral-200" >
              <Link to="/create-AI">Try For Free</Link>
            </button>
          </div>
        </div>   */}

        <div id="faq-section-container">
          <h2 className="title font-mono text-neutral-200 text-3xl font-medium leading-[171.43%] self-stretch w-full mr-px mt-4">
            Frequently Asked Questions
          </h2>
          <div>
            <Accordion items={accordionItems} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
