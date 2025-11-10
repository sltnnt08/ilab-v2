<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreJadwalRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'user_id' => ['required', 'exists:users,id'],
            'mapel_id' => ['required', 'exists:mapels,id'],
            'class_id' => ['required', 'exists:classes,id'],
            'ruangan_id' => ['required', 'exists:ruangans,id'],
            'hari' => ['required', 'in:Senin,Selasa,Rabu,Kamis,Jumat,Sabtu'],
            'jam_mulai' => ['required', 'date_format:H:i'],
            'jam_selesai' => ['required', 'date_format:H:i', 'after:jam_mulai'],
        ];
    }

    public function messages(): array
    {
        return [
            'user_id.required' => 'Guru harus dipilih',
            'user_id.exists' => 'Guru tidak valid',
            'mapel_id.required' => 'Mata pelajaran harus dipilih',
            'mapel_id.exists' => 'Mata pelajaran tidak valid',
            'class_id.required' => 'Kelas harus dipilih',
            'class_id.exists' => 'Kelas tidak valid',
            'ruangan_id.required' => 'Ruangan harus dipilih',
            'ruangan_id.exists' => 'Ruangan tidak valid',
            'hari.required' => 'Hari harus dipilih',
            'hari.in' => 'Hari tidak valid',
            'jam_mulai.required' => 'Jam mulai harus diisi',
            'jam_mulai.date_format' => 'Format jam mulai tidak valid (HH:mm)',
            'jam_selesai.required' => 'Jam selesai harus diisi',
            'jam_selesai.date_format' => 'Format jam selesai tidak valid (HH:mm)',
            'jam_selesai.after' => 'Jam selesai harus setelah jam mulai',
        ];
    }
}
