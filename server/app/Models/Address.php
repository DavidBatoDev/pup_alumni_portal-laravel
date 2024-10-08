<?php
// app/Models/Address.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    use HasFactory;

    protected $table = 'addresses';

    protected $primaryKey = 'address_id';

    protected $fillable = [
        'alumni_id', 'street', 'city', 'state', 'postal_code', 'country'
    ];

    public function alumni()
    {
        return $this->belongsTo(Alumni::class, 'alumni_id', 'alumni_id');
    }
}
