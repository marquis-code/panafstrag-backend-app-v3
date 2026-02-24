const data = {
  aboutUsSubTitle: "Who We Are",
  aboutUsTitle: "About <span class='not-italic text-gray-400'>PANAFSTRAG</span>",
  objectivesSubTitle: "Strategic Alignment",
  objectivesTitle: "Institutional <br class='md:hidden' /> <span class='not-italic text-gray-400'>Objectives</span>",
  responsibilitiesSubTitle: "Code of Conduct",
  responsibilitiesTitle: "Core <br class='md:hidden' /> <span class='not-italic text-gray-400'>Responsibilities</span>",
  programsTitle: "Recent <span class='not-italic text-gray-400'>Programs</span>",
  ctaTitle: "Participate in <br class='hidden md:block' /> <span class='not-italic text-[#2E7D32]'>the Future</span>",
  ctaDescription: "Join a network of leading experts dedicated to solving the most pressing strategic challenges facing the African continent today."
};

fetch('http://localhost:3000/home-content', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
})
.then(response => response.json())
.then(result => {
  console.log('Success:', result);
})
.catch(error => {
  console.error('Error:', error);
});
