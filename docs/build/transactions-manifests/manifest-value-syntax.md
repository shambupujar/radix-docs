---
title: "Manifest Value Syntax"
---

# Manifest Value Syntax

The manifest syntax for instruction arguments forms a representation of an encoded “Manifest SBOR” value. The Manifest SBOR value is converted by the transaction processor into “Scrypto SBOR” which is then used to make calls to other objects in the engine.

A specific SBOR implementation is formed of a core of “basic” value kinds, and then implementation specific additional value kinds. When the transaction processor processes the manifest, it maps basic value kinds are mapped as-is, and remaps the Manifest value kinds to Scrypto value kinds.

### Basic Leaf Value Kinds

Below are all the value kinds in the basic (common) SBOR model.



<table>
<colgroup>
<col />
<col />
</colgroup>
<tbody>
<tr>
<td>Basic Value Kind</td>
<td>Manifest Syntax Example</td>
</tr>
<tr>
<td><code>Bool</code></td>
<td><p><code>true</code></p>
<p><code>false</code></p></td>
</tr>
<tr>
<td><code>I8</code>, <code>I16</code>, <code>I32</code>, <code>I64</code>, <code>I128</code></td>
<td><p><code>5i8</code></p>
<p><code>-412i32</code></p>
<p><code>12345678i128</code></p></td>
</tr>
<tr>
<td><code>U8</code>, <code>U16</code>, <code>U32</code>, <code>U64</code>, <code>U128</code></td>
<td><p><code>5u8</code></p>
<p><code>412u32</code></p>
<p><code>12345678u128</code></p></td>
</tr>
<tr>
<td><code>String</code></td>
<td><p><code>"I like a \"quoted message\"!\n"</code></p>
<p>Strings must be valid unicode. The string literal follows JSON escaping rules:</p>
<ul>
<li><p>Double quotes must be escaped as <code>\”</code>, and backslashes must be escaped as <code>\\</code>.</p></li>
<li><p>You can optionally also use the following escapes: <code>\/</code>, <code>\b</code>, <code>\f</code>, <code>\n</code>, <code>\r</code>, <code>\t</code> and <code>\uXXXX</code> where X are exactly four hex digits, i.e. a UTF-16 encoding. The resultant string must be valid unicode (so not unmatched surrogate pairs).</p></li>
</ul>
<p>If writing in Javascript, <code>JSON.stringify(value)</code> can be used to encode a valid string literal.</p></td>
</tr>
</tbody>




### Basic Composite Value Kinds

Below are all the composite value kinds in the basic (common) SBOR model.



<table>
<colgroup>
<col />
<col />
</colgroup>
<tbody>
<tr>
<td>Basic Value Kind</td>
<td>Manifest Syntax Example</td>
</tr>
<tr>
<td><p><code>Tuple</code></p>
<ul>
<li><p>Represents a product type, such as a Rust tuple or struct.</p></li>
<li><p>Contains 0 or more child values.</p></li>
</ul></td>
<td><p>Examples:</p>
<ul>
<li><p><code>Tuple(“Hello”, 43u8)</code></p></li>
<li><p><code>Tuple()</code></p></li>
</ul>
<p>As an example, if you want to reference a structure or tuple from Scrypto, all the three examples below would have their values written in the form <code>Tuple(55u64, "David")</code>:</p>
<pre class="language-rust" dir="ltr"><code>#[derive(ScryptoSbor)]
pub struct Student {
    id: u64,
    name: String,
}
&#10;#[derive(ScryptoSbor)]
pub struct StudentTwo(u64, String)
&#10;(u64, String)</code></pre></td>
</tr>
<tr>
<td><p><code>Enum</code></p>
<ul>
<li><p>Represents the value of a sum-type (combined with a product type), such as a Rust enum.</p></li>
<li><p>Technically this represents an Enum <strong>Variant</strong> value, but was shortened to <code>Enum</code> for brevity.</p></li>
<li><p>An Enum Variant consists of:</p>
<ul>
<li><p>A `u8` <strong>discriminator</strong> - this is typically the 0-index of the variant under the enum in Rust.</p></li>
<li><p>0 or more child values, which form part of the enum variant.</p></li>
</ul></li>
</ul></td>
<td><p>The canonical representation is:</p>
<ul>
<li><p><code>Enum&lt;1u8&gt;()</code></p></li>
<li><p><code>Enum&lt;24u8&gt;("Hello", "world")</code></p></li>
</ul>
<p>Some engine-specific enums also have a nicer alias-syntax for their variants, eg:</p>
<pre class="language-bash" dir="ltr"><code>Enum&lt;AccessRule::Protected&gt;(
  Enum&lt;AccessRuleNode::ProofRule&gt;(
    Enum&lt;ProofRule::Require&gt;(
      Enum&lt;ResourceOrNonFungible::NonFungible&gt;(
        NonFungibleGlobalId(&quot;...&quot;)
      )
    )
  )
)</code></pre>
<p>The full list of <a href="https://github.com/radixdlt/radixdlt-scrypto/blob/main/radix-transactions/src/manifest/manifest_enums.rs">supported manifest enum variant names is given here</a>.</p>
<p>Option and Result also have rust-like ident aliases for their variants, and so can be represented as <code>Some("value")</code> / <code>None</code> and <code>Ok("Success")</code> / <code>Err("Failure!")</code>.</p>
<p>If you are representing enum variants of an enum defined in scrypto, you can’t use the alias-syntax, and instead will have to rely on discriminant numbers. So you’ll need to work out the enum variant to use. EG the <code>MouseMove</code> variant below has index 1, and has two <code>u32</code> fields, so you would write this in your transaction manifest as <code>Enum&lt;1u8&gt;(320u32, 480u32)</code>. Similarly, the <code>MousePress</code> variant has index 3, and a single <code>String</code> field, so would be represented as eg <code>Enum&lt;3u8&gt;("scroll-wheel")</code>.</p>
<pre class="language-rust" dir="ltr"><code>#[scrypto(ScryptoSbor)]
pub enum Event {
    PageLoad,
    MouseMove(u32, u32),
    KeyPress(String),
    MousePress { button_name: String }
}</code></pre></td>
</tr>
<tr>
<td><p><code>Array</code></p>
<ul>
<li><p>Represents a repeated value (such as an Array / Vec / Set / List, etc)</p></li>
<li><p>All contained values must be of the same value kind. This value kind is specified in the angle brackets.</p></li>
<li><p>This also includes bytes - which are effectively an <code>Array&lt;U8&gt;</code>, although their canonical representation is using the <code>Bytes("&lt;hex&gt;")</code> alias covered later.</p></li>
</ul></td>
<td><code>Array&lt;String&gt;("foo", "bar")</code></td>
</tr>
<tr>
<td><p><code>Map</code></p>
<ul>
<li><p>Represents a map (effectively an array of two-tuples).</p></li>
<li><p>All contained values must have the same value kind for their keys and the same value kind for their values. These value kinds are specified in the angle brackets.</p></li>
</ul></td>
<td><p><code>Map&lt;U8, U16&gt;(1u8 =&gt; 5u16, 2u8 =&gt; 7u16)</code></p>
<p>You can also nest Map:</p>
<pre class="language-bash" dir="ltr"><code>Map&lt;String, Tuple&gt;(
    &quot;Blueprint&quot; =&gt; Tuple(
        Map&lt;String, U32&gt;(
            &quot;method&quot; =&gt; 1u32
        ),
        0u32
    )
);</code></pre></td>
</tr>
</tbody>




### Manifest Value Kinds



<table>
<colgroup>
<col />
<col />
</colgroup>
<tbody>
<tr>
<td>Manifest Value Kind</td>
<td>Example</td>
</tr>
<tr>
<td><p><code>Address</code></p>
<p>Resolves to a reference to the given address - either fixed, or from a bound reference.</p>
<p><br />
</p>
<p>If used as a NamedAddress:</p>
<ul>
<li><p>The first instruction using this will bind the given name to the given created address.</p></li>
<li><p>In the compiled representation, names are removed and replaced with integer indexed references.</p></li>
</ul></td>
<td><ul>
<li><p>Fixed address:</p>
<ul>
<li><p><code>Address("package_address")</code></p></li>
<li><p><code>Address("component_address")</code></p></li>
<li><p><code>Address("resource_address")</code></p></li>
</ul></li>
<li><p>Bound named address (eg from AddressReservation):</p>
<ul>
<li><code>NamedAddress("my_package")</code></li>
</ul></li>
</ul></td>
</tr>
<tr>
<td><p><code>AddressReservation</code></p>
<ul>
<li><p>Resolves to an owned AddressReservation.</p></li>
<li><p>The first instruction using this will bind the given name to the given created/bound AddressReservation.</p></li>
<li><p>In the compiled representation, names are removed and replaced with integer indexed references.</p></li>
</ul></td>
<td><code>AddressReservation("address_reservation")</code></td>
</tr>
<tr>
<td><p><code>Bucket</code></p>
<ul>
<li><p>Resolves to an owned FungibleBucket or NonFungibleBucket.</p></li>
<li><p>The first instruction using this will bind the given name to the given created/bound bucket.</p></li>
<li><p>In the compiled representation, names are removed and replaced with integer indexed references.</p></li>
</ul></td>
<td><ul>
<li><p>Named bucket, <code>Bucket("my_awesome_xrd_bucket")</code></p></li>
<li><p>Unnamed bucket, <code>Bucket(5u32)</code></p></li>
</ul></td>
</tr>
<tr>
<td><p><code>Proof</code></p>
<ul>
<li><p>Resolves to an owned FungibleProof or NonFungibleProof.</p></li>
<li><p>The first instruction using this will bind the given name to the given created/bound proof.</p></li>
<li><p>In the compiled representation, names are removed and replaced with integer indexed references.</p></li>
</ul></td>
<td><ul>
<li><p>Named proof, <code>Proof("auth")</code></p></li>
<li><p>Unnamed proof, <code>Proof(100u32)</code></p></li>
</ul></td>
</tr>
<tr>
<td><p><code>Expression</code></p>
<p>Resolves to an array of owned Buckets or owned Proofs respectively.</p></td>
<td><p>Only the following are supported:</p>
<ul>
<li><p><code>Expression("ENTIRE_WORKTOP")</code></p></li>
<li><p><code>Expression("ENTIRE_AUTH_ZONE")</code></p></li>
</ul></td>
</tr>
<tr>
<td><p><code>Blob</code></p>
<p>Resolves to a <code>Vec&lt;u8&gt;</code> of the content of the blob with the given hash in the transaction intent.</p></td>
<td><code>Blob("&lt;black2b_hash_of_the_blob_contents&gt;")</code></td>
</tr>
<tr>
<td><p><code>Decimal</code></p>
<p>Resolves as a Decimal.</p></td>
<td><code>Decimal("-123.456")</code></td>
</tr>
<tr>
<td><p><code>PreciseDecimal</code></p>
<p>Resolves as a PreciseDecimal.</p></td>
<td><code>PreciseDecimal("1231232342342.123213123123")</code></td>
</tr>
<tr>
<td><p><code>NonFungibleLocalId</code></p>
<p>Resolves as a NonFungibleLocalId.</p></td>
<td><ul>
<li><p>String: <code>NonFungibleLocalId("&lt;SomeId&gt;")</code></p></li>
<li><p>Integer: <code>NonFungibleLocalId("#12123#")</code></p></li>
<li><p>Bytes: <code>NonFungibleLocalId("[031b84c5567b126440995d3ed5aaba05]")</code></p></li>
<li><p>RUID: <code>NonFungibleLocalId("{43968a7243968a72-5954595459545954-45da967845da9678-8659dd398659dd39}")</code></p></li>
</ul></td>
</tr>
</tbody>




### Manifest aliases



<table>
<colgroup>
<col />
<col />
</colgroup>
<tbody>
<tr>
<td>Manifest Alias</td>
<td>Example</td>
</tr>
<tr>
<td><p><code>Unit</code></p>
<p>Resolves as a Tuple of length 0.</p></td>
<td><code>()</code></td>
</tr>
<tr>
<td><p><code>NonFungibleGlobalId</code></p>
<p>Resolves as a Tuple of the resource address and the non fungible local id.</p></td>
<td><p>Various examples:</p>
<ul>
<li><p>String: <code>NonFungibleGlobalId("\${non_fungible_resource_address}:&lt;string-value&gt;")</code></p></li>
<li><p>Integer: <code>NonFungibleGlobalId("\${non_fungible_resource_address}:#123#")</code></p></li>
<li><p>Bytes: <code>NonFungibleGlobalId("\${non_fungible_resource_address}:[031b84c5567b12643213]")</code></p></li>
<li><p>RUID: <code>NonFungibleGlobalId("\${non_fungible_resource_address}:{..-..-..-..}")</code></p></li>
</ul>
<p>Which resolves to:</p>
<ul>
<li><code>Tuple(Address("\${non_fungible_resource_address}"), NonFungibleLocalId("..."))</code></li>
</ul></td>
</tr>
<tr>
<td><p><code>Bytes</code></p>
<p>Resolves as an Array&lt;U8&gt; via hex decoding. This is the canonical representation of a Array&lt;U8&gt; in the manifest.</p></td>
<td><code>Bytes("deadbeef")</code></td>
</tr>
<tr>
<td><p>Various Enum ident aliases:</p>
<ul>
<li><p><code>Some</code> / <code>None</code></p></li>
<li><p><code>Ok</code> / <code>Err</code></p></li>
</ul>
<p>These resolve to the relevant enum variant.</p></td>
<td><p>Examples:</p>
<pre class="language-bash" dir="ltr"><code>Some(&quot;Hello World&quot;)
None
Ok(&quot;Success message.&quot;)
Err(&quot;Failure message.&quot;)</code></pre></td>
</tr>
</tbody>




## Expressions

At the moment, two expressions are available. `Expression("ENTIRE_WORKTOP")` takes all resources present on the worktop and puts them in a vector of buckets that can then be used as an argument. `Expression("ENTIRE_AUTH_ZONE")` works similarly but with proofs present on the AuthZone.
