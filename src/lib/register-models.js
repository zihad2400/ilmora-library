// এই ফাইলটি নিশ্চিত করে যে সব Mongoose মডেল প্রোডাকশন বিল্ডে রেজিস্টার্ড থাকে
import "./db";
import User from "@/models/User";
import Book from "@/models/Book";
import Author from "@/models/Author";
import Publisher from "@/models/Publisher";
import Category from "@/models/Category";
import BookCopy from "@/models/BookCopy";
import BorrowRequest from "@/models/BorrowRequest";
import BorrowRecord from "@/models/BorrowRecord";
import RenewalRequest from "@/models/RenewalRequest";
import Reservation from "@/models/Reservation";
import Notification from "@/models/Notification";
import Fine from "@/models/Fine";
import ActivityLog from "@/models/ActivityLog";
import LibrarySettings from "@/models/LibrarySettings";

// মডেলগুলো এক্সপোর্ট করা (যদিও দরকার নেই, তবুও নিশ্চিত করার জন্য)
export {
  User, Book, Author, Publisher, Category, BookCopy,
  BorrowRequest, BorrowRecord, RenewalRequest, Reservation,
  Notification, Fine, ActivityLog, LibrarySettings
};
