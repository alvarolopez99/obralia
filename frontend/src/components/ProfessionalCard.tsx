import React from 'react';
import Image from 'next/image';
import { FiMapPin, FiCheckCircle, FiStar } from 'react-icons/fi';
import Link from 'next/link';
import { AiFillStar } from 'react-icons/ai';

interface ProfessionalCardProps {
  name: string;
  profession: string;
  rating: number;
  reviews: number;
  price: string;
  image: string;
  location: string;
  verified: boolean;
  id: string | number;
}

function ProfessionalCard({
  name,
  profession,
  rating,
  reviews,
  price,
  image,
  location,
  verified,
  id,
}: ProfessionalCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow p-0 flex flex-col overflow-hidden border border-gray-100 hover:border-blue-200 group">
      <div className="relative h-48 w-full">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="flex-1 flex flex-col px-5 py-4 gap-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-blue-600 capitalize">{profession}</span>
          <span className="flex items-center gap-1 text-yellow-500 font-semibold text-sm">
            <AiFillStar className="inline" size={16} />
            {rating}
            <span className="text-gray-400 font-normal">({reviews})</span>
          </span>
        </div>
        <div className="flex items-center mb-1">
          <h3 className="font-semibold text-lg text-gray-900 truncate">{name}</h3>
          {verified && (
            <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded font-semibold">Verificado</span>
          )}
        </div>
        <div className="flex items-center text-gray-500 text-sm mb-2">
          <FiMapPin className="mr-1 text-blue-400" size={16} />
          <span>{location}</span>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="text-2xl font-bold text-gray-900">
            {price}
            <span className="text-sm font-normal text-gray-500">/hora</span>
          </div>
          <Link
            href={`/professional/${id}`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Conectar
          </Link>
        </div>
      </div>
    </div>
  );
}

export default React.memo(ProfessionalCard); 