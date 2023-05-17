import Image from 'next/image';

export default function Header() {
	return (
		<header className="shadow-md bg-white">
			<Image
				src="/sec-logo.svg"
				alt="Southeastern Conference"
				width={100}
				height={100}
				priority
			/>
			<h1>Fampicks</h1>
		</header>
	)
}
