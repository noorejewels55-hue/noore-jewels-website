import { NextResponse } from 'next/server';
import { saveCustomer } from '@/lib/sheets';

export async function POST(request) {
    try {
        const { phone, name } = await request.json();

        if (!phone || !name || name.trim().length < 2) {
            return NextResponse.json(
                { success: false, message: 'Please enter your full name' },
                { status: 400 }
            );
        }

        const cleanPhone = phone.replace(/\D/g, '');
        const cleanName = name.trim();

        // Save to Google Sheets
        try {
            await saveCustomer({
                phone: cleanPhone,
                name: cleanName,
            });
        } catch (e) {
            console.error('Error saving customer:', e);
        }

        return NextResponse.json({
            success: true,
            user: {
                phone: cleanPhone,
                name: cleanName,
            },
        });

    } catch (error) {
        console.error('Register error:', error);
        return NextResponse.json(
            { success: false, message: 'Registration failed. Please try again.' },
            { status: 500 }
        );
    }
}
