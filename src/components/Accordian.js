import React, { useState } from 'react';


const AccordionItem = ({ title, content, isOpen, onToggle }) => (
  <div className="border-b">
    <div
      className="flex justify-between items-center p-4 cursor-pointer"
      onClick={onToggle}
    >
      <div className="font-semibold">{title}</div>
      <div className={`transform ${isOpen ? 'rotate-0' : 'rotate-180'} transition-transform`}>
        &#x2b;
      </div>
    </div>
    {isOpen && <div className="p-4">{content}</div>}
  </div>
);

const Accordion = ({ items }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div className="font-mono accordian w-full text-white p-4 mb-5">
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          title={item.title}
          content={item.content}
          isOpen={openIndex === index}
          onToggle={() => handleToggle(index)}
        />
      ))}
    </div>
  );
};

export default Accordion;
