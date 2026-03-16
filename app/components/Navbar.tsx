import { useState } from "react";
import { Link } from "react-router";
import { Button } from "./Button";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-gray-800">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <div className="text-white text-lg font-bold">
                        Titikkoma
                    </div>

                    {/* Desktop menu */}
                    <div className="hidden md:flex space-x-6">
                        <Link to="/" className="text-gray-300 hover:text-white">
                            Home
                        </Link>
                        <Link to="/about" className="text-gray-300 hover:text-white">
                            About
                        </Link>
                        <Link to="/contact" className="text-gray-300 hover:text-white">
                            Contact
                        </Link>
                    </div>

                    {/* Mobile button */}
                    <Button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
                        ☰
                    </Button>
                </div>

                {/* Mobile menu */}
                {isOpen && (
                    <div className="md:hidden flex flex-col space-y-2 pb-4">
                        <Link to="/" className="text-gray-300 hover:text-white">
                            Home
                        </Link>
                        <Link to="/about" className="text-gray-300 hover:text-white">
                            About
                        </Link>
                        <Link to="/contact" className="text-gray-300 hover:text-white">
                            Contact
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}