// export default function ContactPage() {
//   return ( 
//     <main className="flex justify-center items-center bg-gray-200 min-h-screen">
//       {/* <script type="text/javascript"
//         src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js">
//       </script>
//       <script type="text/javascript">
//         (function(){
//             emailjs.init("UHSSbPh-j0hEtzASh")
//             })();
//       </script> */}
//       {/* <script src="fashionFinder-frontend/src/components/buttons/ContactUsPageButton2.js"></script> */}
//       <script src="fashionFinder-frontend\src\app\contact\inputFieldsFunction.js"></script>
//       <div className="flex flex-col items-center bg-white p-8 rounded shadow-md w-5/6">
//         <h3 className="text-3xl font-bold mb-4">CONTACT US</h3>
        
//         <form>
//           <div className="mb-4">
//             <label htmlFor="fullName" className="block text-sm font-medium text-gray-600">
//               Full Name*
//             </label>
//             <div className="flex space-x-2">
//               <input
//                 type="text"
//                 id="firstName"
//                 name="firstName"
//                 placeholder="First name"
//                 className="w-full p-2 mb-4 md:w-5/6 md:mr-2 border border-gray-300 rounded"
//               />
//               <input
//                 type="text"
//                 id="lastName"
//                 name="lastName"
//                 placeholder="Last name"
//                 className="w-full p-2 mb-4 md:w-5/6 border border-gray-300 rounded"
//               />
//             </div>
//           </div>

//           <div className="mb-4">
//             <label htmlFor="email" className="block text-sm font-medium text-gray-600">
//               Email Address*
//             </label>
//             <input
//               type="text"
//               id="email"
//               name="email"
//               placeholder="Email address"
//               className="w-full p-2 mb-4 md:w-5/6 border border-gray-300 rounded"
//             />
//           </div>

//           <div className="w-full md:w-11/12 mb-4">
//             <label htmlFor="message" className="block text-sm font-medium text-gray-600">
//               Message*
//             </label>
//             <textarea
//               id="message"
//               name="message"
//               placeholder="Write your message"
//               className="w-full p-2 border border-gray-300 rounded resize"
//             />
//           </div>

//           <button type="submit" className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800">
//           Send Message
//           </button>
//         </form>
//       </div>
//     </main>
//   ); 
// }


export default function ContactPage() {
  return ( 
    <main className="flex justify-center items-center bg-gray-200 min-h-screen">
      <div className="flex flex-col items-center bg-white p-8 rounded shadow-md w-5/6">
        <script src="https://cdn.jsdeliver.net/npm/@emailjs/brower@3/dist/email.min.js"></script>
        <script src="src/components/buttons/ContactUsPageButton.js"></script>
        <h3 className="text-3xl font-bold mb-4">CONTACT US</h3>
        
        <form action="./send_email" method="send">
        {/* <form action="./send_email" method="get"> */}
          <div className="mb-4">
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-600">
              Full Name*
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                id="firstName"
                name="firstName"
                placeholder="First name"
                className="w-full p-2 mb-4 md:w-5/6 md:mr-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                id="lastName"
                name="lastName"
                placeholder="Last name"
                className="w-full p-2 mb-4 md:w-5/6 border border-gray-300 rounded"
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">
              Email Address*
            </label>
            <input
              type="text"
              id="email"
              name="email"
              placeholder="Email address"
              className="w-full p-2 mb-4 md:w-5/6 border border-gray-300 rounded"
            />
          </div>

          <div className="w-full md:w-11/12 mb-4">
            <label htmlFor="message" className="block text-sm font-medium text-gray-600">
              Message*
            </label>
            <textarea
              id="message"
              name="message"
              placeholder="Write your message"
              className="w-full p-2 border border-gray-300 rounded resize"
            />
          </div>

          <button type="submit" className="bg-black text-white py-2 px-4 rounded hover:bg-gray-600">
            Send Message
          </button>
          
          <sendEmail />
        </form>
      </div>
    </main>
  ); 
}