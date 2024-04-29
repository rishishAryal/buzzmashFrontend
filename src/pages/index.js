import { Inter } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
export default function Home() {
  return (
    <main>
      <div className="w-full flex justify-between items-center h-[95vh] mx-[100px]">
        <div className="w-3/4">
          <h1 className="my-9">
            <span className="text-4xl font-bold">Welcome to BuzzMash</span>
          </h1>
          <p className=" text-sm mt-4">
            Welcome to BuzzMash, where the young and the restless meet the bold
            and the bloggy! If you've ever wondered where all the cool cats and
            keyboard warriors are hanging out, you've just hit the jackpot.
          </p>
          <p className="text-sm mt-4">
            BuzzMash is more than just a blogging platform; it’s the go-to
            digital hangout for anyone who likes their content like they like
            their coffee – fresh, strong, and capable of keeping you interested
            all day. Whether you’re here to scope out the latest meme trends,
            untangle the web of tech developments, or sneak a peek at the next
            big thing in streetwear, we’ve got you covered.
          </p>

          <p className="text-sm mt-4">
            Dip into our eclectic mix of articles, ranging from why avocados are
            still a thing to serious deep dives on digital privacy (because,
            let’s face it, who isn’t stalking their pets on Petstagram?). And
            don’t forget about our lifestyle hacks that can even make your
            laundry seem fun (well, almost).
          </p>
          <p className="text-sm mt-4">
            So, buckle up and prepare for a ride on the wild side of the
            internet. Engage in the conversation, laugh over a satire piece, or
            get lost in a thought-provoking read. At BuzzMash, it’s all about
            creating, connecting, and cracking up. Start exploring now—because
            missing out might just be the next big fear of missing out!
          </p>
        </div>

        <div className="w-3/4">
          <Image src={"/blog.png"} width={700} height={700}></Image>
        </div>
      </div>

      <div className="w-full mx-[100px]">
        <h1 className="text-4xl font-bold">
          Start Blogging with these easy step
        </h1>
        <div className="flex justify-between items-center">
        <div className="w-1/2">
          <h1 className="text-2xl mt-[40px]">
            Step 1: Create an account or Login to your account
          </h1>
          <p>
            To start blogging, you need to create an account or login to your
            account. If you already have an account, click on the login button
            below.
          </p>
          <Link
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 inline-block"
          href={"/auth/login"}>

              Login

          </Link>

        </div>
        
        <div className="w-1/2">
          <Image src={"/login.png"} width={500} height={500}></Image>
        </div>
        </div>
        <div className="flex justify-between items-center">

        <div className="w-1/2">
          <Image src={"/blogging.png"} width={500} height={500}></Image>
        </div>

        <div className="w-1/2">
          <h1 className="text-2xl mt-[40px]">
            Step 2: Once you are logged in, you can start blogging
          </h1>
          <p>
            To create a new blog post, click on the "Create Post" button below.
          </p>
          <Link
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 inline-block"
          href={"/blogs/create"}>

              Create Post

          </Link>

        </div>
        
       
        </div>

      </div>
    </main>
  );
}
