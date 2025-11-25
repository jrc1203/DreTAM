import React, { useState, useRef, useEffect } from 'react';

const FilterDropdown = ({ options, value, onChange, defaultLabel = 'All Employees', containerClassName = "glass p-3 rounded-lg" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (optionValue) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    const selectedLabel = options.find(opt => opt.value === value)?.label || defaultLabel;

    return (
        <div className={containerClassName}>
            <div className="relative inline-block text-left" ref={menuRef}>
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/50 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-[#6C63FF] transition-all min-w-[160px] justify-between"
                >
                    <span className="truncate max-w-[140px]">{value ? selectedLabel : defaultLabel}</span>
                    <svg className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''} flex-shrink-0`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>

                {isOpen && (
                    <div className="origin-top-left absolute left-0 mt-2 w-64 rounded-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl z-[60] animate-fade-in-down max-h-60 overflow-y-auto custom-scrollbar">
                        <div className="py-1">
                            <button
                                onClick={() => handleSelect('')}
                                className={`flex items-center w-full text-left px-4 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-white/10 transition-colors ${value === '' ? 'text-[#6C63FF] font-semibold bg-gray-50 dark:bg-white/5' : 'text-gray-700 dark:text-gray-200'}`}
                            >
                                {defaultLabel}
                            </button>
                            {options.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => handleSelect(option.value)}
                                    className={`flex items-center w-full text-left px-4 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-white/10 transition-colors ${value === option.value ? 'text-[#6C63FF] font-semibold bg-gray-50 dark:bg-white/5' : 'text-gray-700 dark:text-gray-200'}`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FilterDropdown;
