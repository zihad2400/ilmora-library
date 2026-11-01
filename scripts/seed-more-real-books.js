import "dotenv/config";
import mongoose from "mongoose";
import Book from "../src/models/Book.js";
import Author from "../src/models/Author.js";
import Category from "../src/models/Category.js";
import Publisher from "../src/models/Publisher.js";
import BookCopy from "../src/models/BookCopy.js";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ilmora";

// বিখ্যাত ইসলামিক স্কলার ও লেখকদের ১০০টি বই
const ISLAMIC_AUTHORS_BOOKS = [
  { title: "তাফসীরে ফী যিলালিল কুরআন", author: "সাইয়েদ কুতুব শহীদ", cat: "Quran & Tafsir" },
  { title: "কুরআনের ছায়ায়", author: "সাইয়েদ কুতুব শহীদ", cat: "Quran & Tafsir" },
  { title: "ইসলাম ও আমাদের জীবন", author: "মাওলানা আবদুল্লাহ জাহাঙ্গীর", cat: "Islamic Education" },
  { title: "হাদীসের নামে জালিয়াতি", author: "মাওলানা আবদুল্লাহ জাহাঙ্গীর", cat: "Hadith" },
  { title: "রাসূলুল্লাহ (সা.) এর জীবনী", author: "মাওলানা আবদুল্লাহ জাহাঙ্গীর", cat: "Islamic History" },
  { title: "কুরআন-সুন্নাহর আলোকে ইসলামী আকীদা", author: "মাওলানা আবদুল্লাহ জাহাঙ্গীর", cat: "Islamic Education" },
  { title: "আহকামুত তিলাওয়াত", author: "মাওলানা আবদুল্লাহ জাহাঙ্গীর", cat: "Quran & Tafsir" },
  { title: "ইসলামের ইতিহাস", author: "মাওলানা আবদুল্লাহ জাহাঙ্গীর", cat: "Islamic History" },
  { title: "নামাজের বিধান", author: "মাওলানা আবদুল্লাহ জাহাঙ্গীর", cat: "Islamic Education" },
  { title: "রোজার বিধান", author: "মাওলানা আবদুল্লাহ জাহাঙ্গীর", cat: "Islamic Education" },
  { title: "ইসলামের দৃষ্টিতে নারী", author: "মাওলানা আবদুল্লাহ জাহাঙ্গীর", cat: "Islamic Education" },
  { title: "ভারতবর্ষে ইসলাম", author: "আবুল কালাম আজাদ", cat: "Islamic History" },
  { title: "আল-হিলাল", author: "আবুল কালাম আজাদ", cat: "Islamic Literature" },
  { title: "ইন্ডিয়া উইনস ফ্রিডম", author: "আবুল কালাম আজাদ", cat: "Islamic History" },
  { title: "তাযকিয়াতুন নাফস", author: "শায়খ আহমাদুল্লাহ", cat: "Islamic Literature" },
  { title: "রবের সান্নিধ্যে", author: "শায়খ আহমাদুল্লাহ", cat: "Islamic Literature" },
  { title: "সালাতুত তারাবীহ", author: "শায়খ আহমাদুল্লাহ", cat: "Islamic Education" },
  { title: "ইসলামি বিধান ও মাসায়েল", author: "শায়খ আহমাদুল্লাহ", cat: "Islamic Education" },
  { title: "সমকালীন প্রসঙ্গ", author: "মিজানুর রহমান আজহারী", cat: "Islamic Literature" },
  { title: "দুর্দিনের যাত্রী", author: "মিজানুর রহমান আজহারী", cat: "Islamic Literature" },
  { title: "ভয় পেয়ো না", author: "মিজানুর রহমান আজহারী", cat: "Islamic Literature" },
  { title: "হারিয়ে যাওয়া মুক্তো", author: "মিজানুর রহমান আজহারী", cat: "Islamic History" },
  { title: "সিরাতুন নবী", author: "ইবনে হিশাম", cat: "Islamic History" },
  { title: "খুতবাতুল ইসলাম", author: "শায়খ আব্দুর রাজ্জাক বিন ইউসুফ", cat: "Islamic Education" },
  { title: "সুন্নতের আলোকে নামাজ", author: "শায়খ আব্দুর রাজ্জাক বিন ইউসুফ", cat: "Islamic Education" },
  { title: "ফিকহুস সুন্নাহ", author: "সাইয়েদ সাবেক", cat: "Islamic Education" },
  { title: "বুখারী শরীফ", author: "ইমাম বুখারী", cat: "Hadith" },
  { title: "মুসলিম শরীফ", author: "ইমাম মুসলিম", cat: "Hadith" },
  { title: "তিরমিজি শরীফ", author: "ইমাম তিরমিজি", cat: "Hadith" },
  { title: "আবু দাউদ শরীফ", author: "ইমাম আবু দাউদ", cat: "Hadith" },
  { title: "নাসাঈ শরীফ", author: "ইমাম নাসাঈ", cat: "Hadith" },
  { title: "ইবনে মাজাহ শরীফ", author: "ইমাম ইবনে মাজাহ", cat: "Hadith" },
  { title: "মুয়াত্তা ইমাম মালিক", author: "ইমাম মালিক", cat: "Hadith" },
  { title: "মুসনাদে আহমাদ", author: "ইমাম আহমাদ বিন হাম্বল", cat: "Hadith" },
  { title: "দারেমী শরীফ", author: "ইমাম দারেমী", cat: "Hadith" },
  { title: "মিশকাত শরীফ", author: "আল্লামা ওয়ালীউদ্দীন তাবরীযী", cat: "Hadith" },
  { title: "রিয়াদুস সালিহীন", author: "ইমাম নববী", cat: "Hadith" },
  { title: "রিয়াদুন নাদিয়াহ", author: "আল্লামা মুহাম্মদ বিন আলী", cat: "Hadith" },
  { title: "বুলুগুল মারাম", author: "হাফেজ ইবনে হাজার আসকালানী", cat: "Hadith" },
  { title: "উমদাতুল আহকাম", author: "শায়খুল ইসলাম ইবনে তাইমিয়্যাহ", cat: "Hadith" },
  { title: "আল-আদাবুল মুফরাদ", author: "ইমাম বুখারী", cat: "Hadith" },
  { title: "সিলসিলাতুল আহাদীস আস-সহীহা", author: "শায়খ আলবানী", cat: "Hadith" },
  { title: "সহীহ আত-তারগীব ওয়াত তারহীব", author: "শায়খ আলবানী", cat: "Hadith" },
  { title: "তাফসীরে তাবারী", author: "ইমাম ইবনে জারীর তাবারী", cat: "Quran & Tafsir" },
  { title: "তাফসীরে কুরতুবী", author: "ইমাম কুরতুবী", cat: "Quran & Tafsir" },
  { title: "তাফসীরে রুহুল মাআনী", author: "আল্লামা শিহাবুদ্দিন আলুসী", cat: "Quran & Tafsir" },
  { title: "তাফসীরে বাগবী", author: "ইমাম বাগবী", cat: "Quran & Tafsir" },
  { title: "তাফসীরে কাশশাফ", author: "আল্লামা জামাখশারী", cat: "Quran & Tafsir" },
  { title: "তাফসীরে মাযহারী", author: "আল্লামা কাযী সানাউল্লাহ পানিপথী", cat: "Quran & Tafsir" },
  { title: "ফাতহুল কাদীর", author: "আল্লামা শাওকানী", cat: "Quran & Tafsir" },
  { title: "আল-বিদায়া ওয়ান নিহায়া", author: "ইমাম ইবনে কাসীর", cat: "Islamic History" },
  { title: "আল-কামিল ফিত তারিখ", author: "ইমাম ইবনুল আছীর", cat: "Islamic History" },
  { title: "তারীখুল ইসলাম", author: "ইমাম আয-যাহাবী", cat: "Islamic History" },
  { title: "আল-মিলাল ওয়ান নিহাল", author: "শাহরাস্তানী", cat: "Islamic History" },
  { title: "আল-ফিসাল ফিল মিলাল", author: "ইবনে হাযম আন্দালুসী", cat: "Islamic History" },
  { title: "খিলাফত ও রাজনীতি", author: "মাওলানা আবুল আ'লা মওদুদী", cat: "Islamic History" },
  { title: "ইসলামী আইনশাস্ত্র", author: "মাওলানা তাকী উসমানী", cat: "Islamic Education" },
  { title: "ইসলাম ও যুগ-জিজ্ঞাসা", author: "মাওলানা তাকী উসমানী", cat: "Islamic Education" },
  { title: "তালীমুল ইসলাম", author: "মুফতি কেফায়েতুল্লাহ", cat: "Islamic Education" },
  { title: "কিতাবুত তাওহীদ", author: "শায়খ মুহাম্মদ বিন আব্দুল ওয়াহহাব", cat: "Islamic Education" },
  { title: "আকীদাতুত তহাবিয়্যাহ", author: "ইমাম তহাবী", cat: "Islamic Education" },
  { title: "আল-আকীদাতুল ওয়াসিতিয়্যাহ", author: "শায়খুল ইসলাম ইবনে তাইমিয়্যাহ", cat: "Islamic Education" },
  { title: "শারহুল আকীদাতিল ওয়াসিতিয়্যাহ", author: "শায়খ ইবনে উসাইমীন", cat: "Islamic Education" },
  { title: "আল-ইরশাদ", author: "শায়খ সালেহ আল-ফাওযান", cat: "Islamic Education" },
  { title: "শারহুল মুমতি", author: "শায়খ ইবনে উসাইমীন", cat: "Islamic Education" },
  { title: "ফিকহুল ইবাদাত", author: "শায়খ ইবনে উসাইমীন", cat: "Islamic Education" },
  { title: "আল-মুলাখখাস আল-ফিকহী", author: "শায়খ সালেহ আল-ফাওযান", cat: "Islamic Education" },
  { title: "মিনহাজুল মুসলিম", author: "আবু বকর জাবির আল-জাযায়েরী", cat: "Islamic Education" },
  { title: "নবীদের কাহিনী", author: "ইমাম ইবনে কাসীর", cat: "Islamic History" },
  { title: "সাহাবীদের জীবনী", author: "মাওলানা ইউসুফ কান্ধলভী", cat: "Islamic History" },
  { title: "হায়াতুস সাহাবা", author: "মাওলানা ইউসুফ কান্ধলভী", cat: "Islamic History" },
  { title: "মুসলিম মনীষীদের জীবনী", author: "মুফতি মুহাম্মদ শফী", cat: "Islamic History" },
  { title: "তাবেঈদের জীবনী", author: "মুফতি মুহাম্মদ শফী", cat: "Islamic History" },
  { title: "আহলে হাদীসদের আকীদা", author: "আল্লামা ইবনে আবিল ইয্য", cat: "Islamic Education" },
  { title: "আল-ফিকহুল ইসলামী", author: "ড. ওয়াহবা যুহাইলী", cat: "Islamic Education" },
  { title: "আল-ফিকহুল ইসলামী ওয়া আদিল্লাতুহু", author: "ড. ওয়াহবা যুহাইলী", cat: "Islamic Education" },
  { title: "তাফসীরে মুনীর", author: "ড. মুহাম্মদ আসাদুল্লাহ আল-গালিব", cat: "Quran & Tafsir" },
  { title: "আকীদা ও মানহাজ", author: "ড. মুহাম্মদ আসাদুল্লাহ আল-গালিব", cat: "Islamic Education" },
  { title: "ইসলামের অর্থনীতি", author: "মুফতি তাকী উসমানী", cat: "Islamic Education" },
  { title: "ইসলামী ব্যাংকিং", author: "মুফতি তাকী উসমানী", cat: "Islamic Education" },
  { title: "হালাল ও হারাম", author: "ইউসুফ আল-কারযাভী", cat: "Islamic Education" },
  { title: "ইসলামে যাকাতের বিধান", author: "ইউসুফ আল-কারযাভী", cat: "Islamic Education" },
  { title: "ইসলামে হালাল-হারাম", author: "শায়খ আলবানী", cat: "Islamic Education" },
  { title: "জান্নাত ও জাহান্নাম", author: "ইমাম ইবনুল কাইয়্যিম", cat: "Islamic Literature" },
  { title: "হাদিউল আরওয়াহ", author: "ইমাম ইবনুল কাইয়্যিম", cat: "Islamic Literature" },
  { title: "মাদারিজুস সালিকীন", author: "ইমাম ইবনুল কাইয়্যিম", cat: "Islamic Literature" },
  { title: "আল-ফাওয়াইদ", author: "ইমাম ইবনুল কাইয়্যিম", cat: "Islamic Literature" },
  { title: "উদাতুস সাবিরীন", author: "ইমাম ইবনুল কাইয়্যিম", cat: "Islamic Literature" },
  { title: "তরিকুল হিজরাতাইন", author: "ইমাম ইবনুল কাইয়্যিম", cat: "Islamic Literature" },
  { title: "ইগাছাতুল লাহফান", author: "ইমাম ইবনুল কাইয়্যিম", cat: "Islamic Literature" },
  { title: "জাদুল মাআদ", author: "ইমাম ইবনুল কাইয়্যিম", cat: "Islamic History" },
  { title: "তাযকিয়াতুন নাফস", author: "শায়খ সালেহ আল-ফাওযান", cat: "Islamic Literature" },
  { title: "লাতাইফুল মাআরিফ", author: "ইমাম ইবনে রজব আল-হাম্বলী", cat: "Islamic Literature" },
  { title: "রুকইয়াহ", author: "শায়খ আব্দুল্লাহ আস-সাদহান", cat: "Islamic Education" },
  { title: "সন্তান প্রতিপালন", author: "শায়খ মুহাম্মদ নাসিরুদ্দিন আল-আলবানী", cat: "Islamic Education" },
  { title: "স্ত্রীর অধিকার ও কর্তব্য", author: "শায়খ ইবনে উসাইমীন", cat: "Islamic Education" },
  { title: "দাম্পত্য জীবন", author: "মুফতি মুহাম্মদ শফী", cat: "Islamic Education" },
  { title: "পারিবারিক জীবন", author: "মাওলানা আশরাফ আলী থানভী", cat: "Islamic Education" },
  { title: "বেহেশতী জেওর", author: "মাওলানা আশরাফ আলী থানভী", cat: "Islamic Education" }
];

// CSE ও প্রোগ্রামিং এর ১০০টি রিয়েল বই
const CSE_BOOKS = [
  { title: "The Art of Computer Programming", author: "Donald E. Knuth", cat: "Computer Science" },
  { title: "Computer Systems: A Programmer's Perspective", author: "Randal E. Bryant", cat: "Computer Science" },
  { title: "Compilers: Principles, Techniques, and Tools", author: "Alfred V. Aho", cat: "Computer Science" },
  { title: "Introduction to the Theory of Computation", author: "Michael Sipser", cat: "Computer Science" },
  { title: "Operating Systems: Three Easy Pieces", author: "Remzi Arpaci-Dusseau", cat: "Computer Science" },
  { title: "Computer Networking: A Top-Down Approach", author: "James F. Kurose", cat: "Computer Science" },
  { title: "Database System Concepts", author: "Abraham Silberschatz", cat: "Database Management" },
  { title: "Fundamentals of Database Systems", author: "Ramez Elmasri", cat: "Database Management" },
  { title: "Modern Operating Systems", author: "Andrew S. Tanenbaum", cat: "Computer Science" },
  { title: "Distributed Systems", author: "Andrew S. Tanenbaum", cat: "Computer Science" },
  { title: "Artificial Intelligence: A Modern Approach", author: "Stuart Russell", cat: "Computer Science" },
  { title: "Deep Learning", author: "Ian Goodfellow", cat: "Computer Science" },
  { title: "Pattern Recognition and Machine Learning", author: "Christopher M. Bishop", cat: "Computer Science" },
  { title: "Clean Code", author: "Robert C. Martin", cat: "Software Engineering" },
  { title: "Clean Architecture", author: "Robert C. Martin", cat: "Software Engineering" },
  { title: "The Clean Coder", author: "Robert C. Martin", cat: "Software Engineering" },
  { title: "Design Patterns", author: "Erich Gamma", cat: "Software Engineering" },
  { title: "Refactoring", author: "Martin Fowler", cat: "Software Engineering" },
  { title: "Domain-Driven Design", author: "Eric Evans", cat: "Software Engineering" },
  { title: "Working Effectively with Legacy Code", author: "Michael Feathers", cat: "Software Engineering" },
  { title: "Test Driven Development: By Example", author: "Kent Beck", cat: "Software Engineering" },
  { title: "Continuous Delivery", author: "Jez Humble", cat: "Software Engineering" },
  { title: "The Mythical Man-Month", author: "Frederick P. Brooks Jr.", cat: "Software Engineering" },
  { title: "The Pragmatic Programmer", author: "Andrew Hunt", cat: "Software Engineering" },
  { title: "Code Complete", author: "Steve McConnell", cat: "Software Engineering" },
  { title: "The Phoenix Project", author: "Gene Kim", cat: "Software Engineering" },
  { title: "Peopleware", author: "Tom DeMarco", cat: "Software Engineering" },
  { title: "Software Engineering", author: "Ian Sommerville", cat: "Software Engineering" },
  { title: "Introduction to Algorithms", author: "Thomas H. Cormen", cat: "Computer Science" },
  { title: "Grokking Algorithms", author: "Aditya Bhargava", cat: "Computer Science" },
  { title: "Cracking the Coding Interview", author: "Gayle Laakmann McDowell", cat: "Computer Science" },
  { title: "System Design Interview", author: "Alex Xu", cat: "Computer Science" },
  { title: "The Algorithm Design Manual", author: "Steven S. Skiena", cat: "Computer Science" },
  { title: "Structure and Interpretation of Computer Programs", author: "Harold Abelson", cat: "Computer Science" },
  { title: "Code: The Hidden Language of Computer Hardware", author: "Charles Petzold", cat: "Computer Science" },
  { title: "Computer Organization and Design", author: "David A. Patterson", cat: "Computer Science" },
  { title: "The C Programming Language", author: "Brian W. Kernighan", cat: "Programming" },
  { title: "Effective C++", author: "Scott Meyers", cat: "Programming" },
  { title: "Effective Java", author: "Joshua Bloch", cat: "Programming" },
  { title: "Head First Java", author: "Kathy Sierra", cat: "Programming" },
  { title: "Python Crash Course", author: "Eric Matthes", cat: "Programming" },
  { title: "Automate the Boring Stuff with Python", author: "Al Sweigart", cat: "Programming" },
  { title: "Fluent Python", author: "Luciano Ramalho", cat: "Programming" },
  { title: "Learning Python", author: "Mark Lutz", cat: "Programming" },
  { title: "Eloquent JavaScript", author: "Marijn Haverbeke", cat: "Programming" },
  { title: "You Don't Know JS Yet", author: "Kyle Simpson", cat: "Programming" },
  { title: "JavaScript: The Good Parts", author: "Douglas Crockford", cat: "Programming" },
  { title: "JavaScript: The Definitive Guide", author: "David Flanagan", cat: "Programming" },
  { title: "Programming Rust", author: "Jim Blandy", cat: "Programming" },
  { title: "The Go Programming Language", author: "Alan A. A. Donovan", cat: "Programming" },
  { title: "HTML and CSS: Design and Build Websites", author: "Jon Duckett", cat: "Web Development" },
  { title: "CSS: The Definitive Guide", author: "Eric A. Meyer", cat: "Web Development" },
  { title: "Learning React", author: "Alex Banks", cat: "Web Development" },
  { title: "React: Up & Running", author: "Stoyan Stefanov", cat: "Web Development" },
  { title: "Fullstack React", author: "Anthony Accomazzo", cat: "Web Development" },
  { title: "Node.js Design Patterns", author: "Mario Casciaro", cat: "Web Development" },
  { title: "Node.js Web Development", author: "David Herron", cat: "Web Development" },
  { title: "Learning SQL", author: "Alan Beaulieu", cat: "Database Management" },
  { title: "SQL Antipatterns", author: "Bill Karwin", cat: "Database Management" },
  { title: "MongoDB: The Definitive Guide", author: "Shannon Bradshaw", cat: "Database Management" },
  { title: "High Performance MySQL", author: "Baron Schwartz", cat: "Database Management" },
  { title: "Designing Data-Intensive Applications", author: "Martin Kleppmann", cat: "Database Management" },
  { title: "The Linux Command Line", author: "William Shotts", cat: "Computer Science" },
  { title: "The Git Pro", author: "Scott Chacon", cat: "Software Engineering" },
  { title: "Learning Git", author: "Anna Skoulikari", cat: "Software Engineering" },
  { title: "Docker Deep Dive", author: "Nigel Poulton", cat: "Software Engineering" },
  { title: "Kubernetes Up & Running", author: "Kelsey Hightower", cat: "Software Engineering" },
  { title: "The DevOps Handbook", author: "Gene Kim", cat: "Software Engineering" },
  { title: "Site Reliability Engineering", author: "Betsy Beyer", cat: "Software Engineering" },
  { title: "Computer Security: Principles and Practice", author: "William Stallings", cat: "Computer Science" },
  { title: "Cryptography and Network Security", author: "William Stallings", cat: "Computer Science" },
  { title: "Web Application Hacker's Handbook", author: "Dafydd Stuttard", cat: "Web Development" },
  { title: "The Tangled Web", author: "Michal Zalewski", cat: "Web Development" },
  { title: "Software Architecture: The Hard Parts", author: "Neal Ford", cat: "Software Engineering" },
  { title: "Building Microservices", author: "Sam Newman", cat: "Software Engineering" },
  { title: "Designing Distributed Systems", author: "Brendan Burns", cat: "Computer Science" },
  { title: "Fundamentals of Software Architecture", author: "Mark Richards", cat: "Software Engineering" },
  { title: "Patterns of Enterprise Application Architecture", author: "Martin Fowler", cat: "Software Engineering" },
  { title: "Release It!", author: "Michael T. Nygard", cat: "Software Engineering" },
  { title: "Accelerate", author: "Nicole Forsgren", cat: "Software Engineering" },
  { title: "The Manager's Path", author: "Camille Fournier", cat: "Software Engineering" },
  { title: "Staff Engineer", author: "Will Larson", cat: "Software Engineering" },
  { title: "The Software Engineer's Guidebook", author: "Gergely Orosz", cat: "Software Engineering" },
  { title: "The Senior Software Engineer", author: "David Bryant Copeland", cat: "Software Engineering" },
  { title: "Cracking the PM Interview", author: "Gayle Laakmann McDowell", cat: "Software Engineering" },
  { title: "Think Like a Programmer", author: "V. Anton Spraul", cat: "Computer Science" },
  { title: "The Pragmatic Programmer", author: "David Thomas", cat: "Software Engineering" },
  { title: "Clean Agile", author: "Robert C. Martin", cat: "Software Engineering" },
  { title: "Agile Software Development", author: "Robert C. Martin", cat: "Software Engineering" },
  { title: "UML Distilled", author: "Martin Fowler", cat: "Software Engineering" },
  { title: "Head First Design Patterns", author: "Eric Freeman", cat: "Software Engineering" },
  { title: "The Rust Programming Language", author: "Steve Klabnik", cat: "Programming" },
  { title: "Programming Pearls", author: "Jon Bentley", cat: "Computer Science" },
  { title: "The C++ Programming Language", author: "Bjarne Stroustrup", cat: "Programming" },
  { title: "Effective Modern C++", author: "Scott Meyers", cat: "Programming" },
  { title: "Java Concurrency in Practice", author: "Brian Goetz", cat: "Programming" },
  { title: "Kotlin in Action", author: "Dmitry Jemerov", cat: "Programming" },
  { title: "Effective TypeScript", author: "Dan Vanderkam", cat: "Programming" },
  { title: "Machine Learning Yearning", author: "Andrew Ng", cat: "Computer Science" },
  { title: "Hands-On Machine Learning", author: "Aurélien Géron", cat: "Computer Science" },
  { title: "Reinforcement Learning", author: "Richard S. Sutton", cat: "Computer Science" },
  { title: "Natural Language Processing with Python", author: "Steven Bird", cat: "Computer Science" },
  { title: "Computer Vision: Algorithms and Applications", author: "Richard Szeliski", cat: "Computer Science" }
];

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log("🔌 Connected to MongoDB");

  // ক্যাটাগরি চেক এবং তৈরি
  const catMap = {};
  const catNames = ["Quran & Tafsir", "Hadith", "Islamic History", "Islamic Education", "Islamic Literature", "CSE Books", "Programming", "Computer Science", "Web Development", "Database Management", "Software Engineering"];
  
  for (const name of catNames) {
    let cat = await Category.findOne({ name });
    if (!cat) {
      cat = await Category.create({ name, slug: name.toLowerCase().replace(/ /g, "-") });
    }
    catMap[name] = cat._id;
  }

  const defaultPublisher = await Publisher.findOne({ name: "Unknown Publisher" }) || await Publisher.create({ name: "Unknown Publisher" });

  let addedCount = 0;
  const allBooks = [...ISLAMIC_AUTHORS_BOOKS, ...CSE_BOOKS];

  for (const b of allBooks) {
    const exists = await Book.findOne({ title: b.title });
    if (exists) continue; // ডুপ্লিকেট হলে স্কিপ করবে

    let author = await Author.findOne({ name: b.author });
    if (!author) {
      author = await Author.create({ name: b.author });
    }

    const isbn = `978-${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    
    const book = await Book.create({
      title: b.title,
      authors: [author._id],
      publisher: defaultPublisher._id,
      category: catMap[b.cat],
      isbn: isbn,
      language: (b.cat.includes("CSE") || b.cat.includes("Programming") || b.cat.includes("Computer") || b.cat.includes("Web") || b.cat.includes("Database") || b.cat.includes("Software")) ? "English" : "Bangla",
      description: `${b.title} - লাইব্রেরির জন্য সংগৃহীত একটি গুরুত্বপূর্ণ বই।`,
      shelfLocation: `S-${Math.floor(10 + Math.random() * 90)}`,
      totalCopies: 1,
      availableCopies: 1,
      isArchived: false
    });

    await BookCopy.create({
      book: book._id,
      copyId: `${isbn.replace(/[^0-9]/g, "").slice(-6)}-C01`,
      status: "AVAILABLE",
      condition: "GOOD",
      shelfLocation: book.shelfLocation
    });

    addedCount++;
  }

  console.log(`🎉 Successfully added ${addedCount} new premium books!`);
  await mongoose.disconnect();
  process.exit(0);
}

run().catch(console.error);
